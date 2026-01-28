import * as migration_20260128_000001 from './20260128_000001_add_color_hex_to_variants';
import * as migration_20260128_000002 from './20260128_000002_add_venues_and_events';
import * as migration_20260128_000003 from './20260128_000003_fix_ride_availability_id';

export const migrations = [
  {
    name: '20260128_000001_add_color_hex_to_variants',
    up: migration_20260128_000001.up,
    down: migration_20260128_000001.down,
  },
  {
    name: '20260128_000002_add_venues_and_events',
    up: migration_20260128_000002.up,
    down: migration_20260128_000002.down,
  },
  {
    name: '20260128_000003_fix_ride_availability_id',
    up: migration_20260128_000003.up,
    down: migration_20260128_000003.down,
  },
];
