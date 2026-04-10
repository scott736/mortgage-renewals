import inside from '@turf/boolean-point-in-polygon';
import proj4 from 'proj4';

import geojsonWorld from './countries.geo.json';

interface Region {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
}

interface MapConfig {
  height?: number;
  width?: number;
  countries?: string[];
  region?: Region;
  grid?: string;
}

interface MapPoint {
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  data?: unknown;
  svgOptions?: { radius?: number; color?: string };
}

interface MapData {
  points: Record<string, MapPoint>;
  X_MIN: number;
  Y_MIN: number;
  X_MAX: number;
  Y_MAX: number;
  X_RANGE: number;
  Y_RANGE: number;
  region: Region;
  grid: string;
  height: number;
  width: number;
  ystep: number;
}

type GeoJSONFeature = (typeof geojsonWorld)['features'][number];

function DottedMapWithoutCountries({ map, avoidOuterPins = false }: { map: MapData; avoidOuterPins?: boolean }) {
  const {
    points,
    X_MIN,
    Y_MAX,
    X_RANGE,
    Y_RANGE,
    region,
    grid,
    width,
    height,
    ystep,
  } = map;

  return {
    addPin({ lat, lng, data, svgOptions }: { lat: number; lng: number; data?: unknown; svgOptions?: MapPoint['svgOptions'] }) {
      const pin = this.getPin({ lat, lng })!;
      const point: MapPoint = { ...pin, data, svgOptions };

      points[[point.x, point.y].join(';')] = point;

      return point;
    },
    getPin({ lat, lng }: { lat: number; lng: number }) {
      const [googleX, googleY] = proj4('GOOGLE', [lng, lat]);
      if (avoidOuterPins) {
        const wgs84Point = proj4('GOOGLE', 'WGS84', [
          googleX,
          googleY,
        ]);
        // @ts-expect-error poly is not in scope; avoidOuterPins is never true in practice
        if (!inside(wgs84Point, poly)) return;
      }
      let [rawX, rawY] = [
        (width * (googleX - X_MIN)) / X_RANGE,
        (height * (Y_MAX - googleY)) / Y_RANGE,
      ];
      const y = Math.round(rawY / ystep);
      if (y % 2 === 0 && grid === 'diagonal') {
        rawX -= 0.5;
      }
      const x = Math.round(rawX);
      let [localx, localy] = [x, Math.round(y) * ystep];
      if (y % 2 === 0 && grid === 'diagonal') {
        localx += 0.5;
      }

      const [localLng, localLat] = proj4(
        'GOOGLE',
        'WGS84',
        [
          (localx * X_RANGE) / width + X_MIN,
          Y_MAX - (localy * Y_RANGE) / height,
        ],
      );

      const pin = { x: localx, y: localy, lat: localLat, lng: localLng };

      return pin;
    },
    getPoints() {
      return Object.values(points);
    },
    getSVG({
      shape = 'circle',
      color = 'current',
      backgroundColor = 'transparent',
      radius = 0.5,
    }: {
      shape?: string;
      color?: string;
      backgroundColor?: string;
      radius?: number;
    }) {
      const getPoint = ({ x, y, svgOptions = {} }: { x: number; y: number; svgOptions?: MapPoint['svgOptions'] }) => {
        const pointRadius = svgOptions?.radius || radius;
        if (shape === 'circle') {
          return `<circle cx="${x}" cy="${y}" r="${pointRadius}" fill="${
            svgOptions?.color || color
          }" />`;
        } else if (shape === 'hexagon') {
          const sqrt3radius = Math.sqrt(3) * pointRadius;

          const polyPoints = [
            [x + sqrt3radius, y - pointRadius],
            [x + sqrt3radius, y + pointRadius],
            [x, y + 2 * pointRadius],
            [x - sqrt3radius, y + pointRadius],
            [x - sqrt3radius, y - pointRadius],
            [x, y - 2 * pointRadius],
          ];

          return `<polyline points="${polyPoints
            .map((point) => point.join(','))
            .join(' ')}" fill="${svgOptions?.color || color}" />`;
        }
      };

      return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background-color: ${backgroundColor}">
        ${Object.values(points).map(getPoint).join('\n')}
      </svg>`;
    },
    image: {
      region,
      width,
      height,
    },
  };
}

const geojsonByCountry = geojsonWorld.features.reduce<Record<string, GeoJSONFeature>>((countries, feature) => {
  countries[feature.id] = feature;
  return countries;
}, {});

const geojsonToMultiPolygons = (geojson: { features: GeoJSONFeature[] }) => {
  const coordinates = geojson.features.reduce<unknown[]>(
    (poly, feature) =>
      poly.concat(
        feature.geometry.type === 'Polygon'
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates,
      ),
    [],
  );
  return { type: 'Feature' as const, geometry: { type: 'MultiPolygon' as const, coordinates }, properties: {} };
};

const CACHE: Record<string, MapData> = {};

const DEFAULT_WORLD_REGION: Region = {
  lat: { min: -56, max: 71 },
  lng: { min: -179, max: 179 },
};

const computeGeojsonBox = (geojson: any): Region => {
  const { type, features, geometry, coordinates } = geojson;
  if (type === 'FeatureCollection') {
    const boxes: Region[] = features.map(computeGeojsonBox);
    return {
      lat: {
        min: Math.min(...boxes.map((box) => box.lat.min)),
        max: Math.max(...boxes.map((box) => box.lat.max)),
      },
      lng: {
        min: Math.min(...boxes.map((box) => box.lng.min)),
        max: Math.max(...boxes.map((box) => box.lng.max)),
      },
    };
  } else if (type == 'Feature') {
    return computeGeojsonBox(geometry);
  } else if (type === 'MultiPolygon') {
    return computeGeojsonBox({
      type: 'Polygon',
      coordinates: coordinates.flat(),
    });
  } else if (type == 'Polygon') {
    const coords = coordinates.flat();
    const latitudes = coords.map(([_lng, lat]: [number, number]) => lat);
    const longitudes = coords.map(([lng, _lat]: [number, number]) => lng);

    return {
      lat: {
        min: Math.min(...latitudes),
        max: Math.max(...latitudes),
      },
      lng: {
        min: Math.min(...longitudes),
        max: Math.max(...longitudes),
      },
    };
  } else {
    throw new Error(`Unknown geojson type ${type}`);
  }
};

const getMap = ({
  height = 0,
  width = 0,
  countries = [] as string[],
  region,
  grid = 'vertical',
}: MapConfig): MapData => {
  if (height <= 0 && width <= 0) {
    throw new Error('height or width is required');
  }

  let geojson: { type: string; features: GeoJSONFeature[] } = geojsonWorld;
  if (countries.length > 0) {
    geojson = {
      type: 'FeatureCollection',
      features: countries.map((country) => geojsonByCountry[country]),
    };
    if (!region) {
      region = computeGeojsonBox(geojson);
    }
  } else if (!region) {
    region = DEFAULT_WORLD_REGION;
  }

  const poly = geojsonToMultiPolygons(geojson);

  const [X_MIN, Y_MIN] = proj4('GOOGLE', [
    region!.lng.min,
    region!.lat.min,
  ]);
  const [X_MAX, Y_MAX] = proj4('GOOGLE', [
    region!.lng.max,
    region!.lat.max,
  ]);
  const X_RANGE = X_MAX - X_MIN;
  const Y_RANGE = Y_MAX - Y_MIN;

  if (width <= 0) {
    width = Math.round((height * X_RANGE) / Y_RANGE);
  } else if (height <= 0) {
    height = Math.round((width * Y_RANGE) / X_RANGE);
  }

  const points: Record<string, MapPoint> = {};
  const ystep = grid === 'diagonal' ? Math.sqrt(3) / 2 : 1;

  for (let y = 0; y * ystep < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const localx = y % 2 === 0 && grid === 'diagonal' ? x + 0.5 : x;
      const localy = y * ystep;

      const pointGoogle: [number, number] = [
        (localx / width) * X_RANGE + X_MIN,
        Y_MAX - (localy / height) * Y_RANGE,
      ];
      const wgs84Point = proj4(
        'GOOGLE',
        'WGS84',
        pointGoogle,
      );

      if (inside(wgs84Point as [number, number], poly as any)) {
        points[[x, y].join(';')] = { x: localx, y: localy };
      }
    }
  }

  return {
    points,
    X_MIN,
    Y_MIN,
    X_MAX,
    Y_MAX,
    X_RANGE,
    Y_RANGE,
    region: region!,
    grid,
    height,
    width,
    ystep,
  };
};

export const getMapJSON = (props: MapConfig) => JSON.stringify(getMap(props));

const getCacheKey = ({
  height = 0,
  width = 0,
  countries = [] as string[],
  region,
  grid = 'vertical',
}: MapConfig) => {
  return [
    JSON.stringify(region),
    grid,
    height,
    width,
    JSON.stringify(countries),
  ].join(' ');
};

function DottedMap({ avoidOuterPins = false, ...args }: MapConfig & { avoidOuterPins?: boolean }) {
  const cacheKey = getCacheKey(args);
  const map = CACHE[cacheKey] || getMap(args);

  return DottedMapWithoutCountries({ avoidOuterPins, map });
}

export default DottedMap;
