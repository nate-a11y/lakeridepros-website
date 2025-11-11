import * as migration_20251111_174626_add_new_collections from './20251111_174626_add_new_collections';

export const migrations = [
  {
    up: migration_20251111_174626_add_new_collections.up,
    down: migration_20251111_174626_add_new_collections.down,
    name: '20251111_174626_add_new_collections'
  },
];
