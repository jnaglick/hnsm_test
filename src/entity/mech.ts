import { defined } from "$util/defined";

export type WeaponDescriptor = Readonly<{
  name: string;
  dmg: number;
  rounds_max: number;
  heat_max: number;
  heat_inc: number;
}>;

export type Weapon = {
  descriptor: WeaponDescriptor;
  rounds_cur: number;
  heat_cur: number;
};

export type MechDescriptor = Readonly<{
  name: string;
  hp_max: number;
  weaponDescriptors: Array<WeaponDescriptor>;
}>;

export type Mech = {
  descriptor: MechDescriptor;
  hp_cur: number;
  weapons: Array<Weapon>;
};

export function mech(mechDescriptor: MechDescriptor): Mech {
  // WEAPONS
  const { weaponDescriptors } = mechDescriptor;

  const weapons = weaponDescriptors
    .map((descriptor) => {
      return {
        descriptor,
        rounds_cur: descriptor.rounds_max,
        heat_cur: 0,
      };
    })
    .filter(defined);

  // ETC...

  return {
    descriptor: mechDescriptor,
    hp_cur: mechDescriptor.hp_max,
    weapons,
  };
}

const Chaingun = {
  name: "chaingun",
  dmg: 1,
  rounds_max: 64,
  heat_max: 16,
  heat_inc: 1,
};

export const WeaponCatalog = {
  Chaingun,
};
