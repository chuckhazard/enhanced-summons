export const conjuringFilters = [
  {
    name: "Summonable",
    function: (creatures) => {
      return creatures.filter(
        (creature) =>
          creature.system.details.cr <= 2 &&
          !creature.name.toLowerCase().includes("swarm")
      )
    },
  },
  {
    name: "Positive CR",
    function: (creatures) => {
      return creatures.filter((creature) => creature.system.details.cr > 0)
    },
  },
]
const packFilter = { category: "Pack", filters: [] }
export const addPackFilter = (name) => {
  if (packFilter.filters.find((f) => f.name == name)) return
  let filter = {
    name,
    function: (creature) => creature.pack == name,
  }
  packFilter.filters.push(filter)
}

export const getFilterGroups = () => {
  if (packFilter.filters.length < 2)
    return conjuringFilterGroups.filter((f) => f.category != "Pack")
  return conjuringFilterGroups
}

const conjuringFilterGroups = [
  {
    category: "CR",
    filters: [
      {
        name: "&frac18;",
        function: (creature) => creature?.system?.details?.cr == 0.125,
      },
      {
        name: "&frac14;",
        function: (creature) => creature?.system?.details?.cr == 0.25,
      },
      {
        name: "&frac12;",
        function: (creature) => creature?.system?.details?.cr == 0.5,
      },
      {
        name: "1",
        function: (creature) => creature?.system?.details?.cr == 1,
      },
      {
        name: "2",
        function: (creature) => creature?.system?.details?.cr == 2,
      },
    ],
  },
  {
    category: "Type",
    filters: [
      {
        name: "Fey",
        function: (creature) => creature?.system?.details?.type.value == "fey",
      },
      {
        name: "Beast",
        function: (creature) =>
          creature?.system?.details?.type.value == "beast",
      },
      {
        name: "Elementals",
        function: (creature) =>
          creature?.system?.details?.type.value == "elemental",
      },
    ],
  },
  {
    category: "Move",
    filters: [
      {
        name: "Walk",
        function: (creature) => creature?.system?.attributes?.movement.walk,
      },
      {
        name: "Fly",
        function: (creature) => creature?.system?.attributes?.movement.fly,
      },
      {
        name: "Burrow",
        function: (creature) => creature?.system?.attributes?.movement.burrow,
      },
      {
        name: "Swim",
        function: (creature) => creature?.system?.attributes?.movement.swim,
      },
    ],
  },
  {
    category: "Vision",
    filters: [
      {
        name: "Darkvision",
        function: (creature) => creature?.system?.attributes?.senses.darkvision,
        disabled: true,
      },
      {
        name: "Blindsight",
        function: (creature) => creature?.system?.attributes?.senses.blindsight,
        disabled: true,
      },
      {
        name: "Tremorsense",
        function: (creature) =>
          creature?.system?.attributes?.senses.tremorsense,
        disabled: true,
      },
      {
        name: "Truesight",
        function: (creature) => creature?.system?.attributes?.senses.truesight,
        disabled: true,
      },
    ],
  },
  {
    category: "Size",
    filters: [
      {
        name: "Tiny",
        function: (creature) => "tiny" == creature?.system?.traits?.size,
      },
      {
        name: "Small",
        function: (creature) => "sm" == creature?.system?.traits?.size,
      },
      {
        name: "Medium",
        function: (creature) => "med" == creature?.system?.traits?.size,
      },
      {
        name: "Large",
        function: (creature) => "lg" == creature?.system?.traits?.size,
      },
      {
        name: "Huge",
        function: (creature) => "huge" == creature?.system?.traits?.size,
      },
      {
        name: "Gargantuan",
        function: (creature) => "grg" == creature?.system?.traits?.size,
      },
    ],
  },
  packFilter,
]
