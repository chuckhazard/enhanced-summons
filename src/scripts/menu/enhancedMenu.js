console.log("importing enhanced menu")
import { MODULE } from "../util/constants.js"
import { LOG } from "../util/logger.js"
import { conjuringFilterGroups, conjuringFilters } from "./filters.js"
import { columns } from "./columns.js"

console.log("importing enhanced menu")

const calculateAttackData = (actor) => {
  let hit = maxToHit(actor)
  let multiattack =
    actor.items.filter((item) => item.name == "Multiattack").length > 0
  let chance = (hit / 20) * multiattack ? 1.5 : 1
  let dmg = averageDamage(actor)
  return { hit, dmg, rating: Math.ceil(chance * averageDamage(actor)) }
}

const averageDamage = (actor) => {
  let items = actor?.items.filter(
    (x) => x?.type == "weapon" && x?.labels?.derivedDamage?.[0]
  )
  let maxDamage = 0
  for (const item of items) {
    for (const entry of item?.labels?.derivedDamage || []) {
      let damage = calculateDamage(entry.formula)
      if (damage > maxDamage) maxDamage = damage
    }
  }
  return maxDamage
}

const damageRegex = /(?<count>\d+)d(?<die>\d+)\s*(?<op>[-+])?\s*(?<mod>\d+)?/
const numberRegex = /(?<value>\d+)/
const calculateDamage = (formula) => {
  let match = damageRegex.exec(formula)
  if (!match) {
    match = numberRegex.exec(formula)
    if (match) return match.groups.value
    else return 0
  }
  const { count, die, op, mod } = match.groups
  let total = Math.ceil((count * die) / 2)
  let bonus = Number(mod ? mod : 0)
  if (op == "-") total -= bonus
  if (!op || op == "+") total += bonus
  return total
}

const maxToHit = (actor) => {
  let items = actor?.items.filter(
    (x) =>
      x?.type == "weapon" && x?.labels?.toHit && x?.labels?.derivedDamage?.[0]
  )
  let hit = 0
  for (const item of items) {
    let value = parseInt(item.labels.toHit.replaceAll(" ", ""))
    if (value && value > hit) hit = value
  }
  // toHitIndex[actor.id] = hit
  return hit
}

/** Call FoundrySummons with a custom set of filters. Instead of the default 
 * filter behavior, where each filter is checked sequentially, the filters are
 * all dummy filters which always return true, except for the final "smart"
 * filter. This filter checks which of the dummy filters are enabled, and
 * filters the collection based on custom rules.
 *  - Each category of filter is treated as an OR test, so if darkvision and
 *    blindsight are selected, creatures with either ability are returned.
 *  - This is applied to the creature type, challenge rating, vision and
 *    movement filters.
 *  - Only beast, fey and elemental types are shown, as these are the only
 *    types eligible for group conjure spells.
 *  - CR 0 are never shown as its assumed they are not worth summoning.
    - CR > 2 are never shown as group conjure spells are capped at CR 2.
    - Swarm creatures are never shown, as they are not eligible for group
      conjure despite carrying the beast type.
 */
const openMenu = () => {
  const foundrySummonOptions = {
    filters: conjuringFilters,
    filterGroups: conjuringFilterGroups,
    columns: columns,
    options: {
      defaultFilters: false,
      defaultSorting: false,
    },
  }

  foundrySummons.openMenu(foundrySummonOptions)
}

const getPackData = (lookup, uuid) => {
  let index = uuid.lastIndexOf(".")
  let key = uuid.slice(0, index)
  let id = uuid.slice(index + 1)
  if (!lookup[key]) {
    let packName = key.replace("Compendium.", "").replace(".Actor", "")
    lookup[key] = game.packs.get(packName)
  }
  return [lookup[key], id]
}

Hooks.once("ready", () => {
  Hooks.on("fs-loadingPacks", async (index) => {
    let packLookup = {}
    for (const entry of index) {
      const [packData, entryId] = getPackData(packLookup, entry.id)
      if (packData) {
        let actor = await packData.getDocument(entryId)
        const { hit, dmg, rating } = calculateAttackData(actor)
        entry.atkRating = rating
        entry.atkHit = hit
        entry.atkDmg = dmg
      } else LOG.error(`Missing pack data for ${entry.id}`)
    }
  })
})

window[MODULE.window] = window[MODULE.window] || {}
window[MODULE.window] = {
  ...(window[MODULE.window] || {}),
  openMenu,
}
