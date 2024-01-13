const i = {
  id: "enhanced-summons",
  flag: "enhanced-summons",
  window: "enhancedSummons"
}, f = {
  STRENGTH: "bear",
  HEALING: "unicorn",
  AGILITY: "hawk"
}, k = 1, S = `[${i.window}]`, u = {
  debug: (e) => k >= 3,
  info: (e) => k >= 2,
  warn: (e) => console.log(`${S} ${e}`),
  error: (e) => console.log(`${S} ${e}`)
}, H = "enhancedSummoner", $ = "powerfulSummons", I = "auraRadius", r = {};
r[H] = {
  name: "Enhanced Summoner Trait(s)",
  // can also be an i18n key
  hint: "Actors with these trait names will be considered for enhanced summoner features.",
  scope: "world",
  // "world" = sync to db, "client" = local storage
  config: !0,
  // false if you dont want it to show in module config
  type: String,
  // Number, Boolean, String, or even a custom class or DataModel
  default: "Circle of the Shepherd",
  onChange: (e) => {
  }
};
r[$] = {
  name: "Powerful Summons Trait(s)",
  // can also be an i18n key
  hint: "Actors with these trait names will summon more powerful summons.",
  scope: "world",
  // "world" = sync to db, "client" = local storage
  config: !0,
  // false if you dont want it to show in module config
  type: String,
  // Number, Boolean, String, or even a custom class or DataModel
  default: "Mighty Summoner",
  onChange: (e) => {
  }
};
r[I] = {
  name: "Aura Radius",
  // can also be an i18n key
  hint: "Radius for the aura template in grid units",
  // can also be an i18n key
  scope: "world",
  // "world" = sync to db, "client" = local storage
  config: !0,
  // false if you dont want it to show in module config
  type: Number,
  // Number, Boolean, String, or even a custom class or DataModel
  default: 6,
  // range: {
  //   // range turns the UI input into a slider input
  //   min: 0, // but does not validate the value
  //   max: 100,
  //   step: 10,
  // },
  onChange: (e) => {
  },
  filePicker: !1,
  // set true with a String `type` to use a file picker input,
  requiresReload: !1
  // when changing the setting, prompt the user to reload
};
let R = [], T = [];
const h = {
  getEnhancedSummonerTags: () => R,
  getPowerfulSummonsTags: () => T,
  getAuraRadius: () => game.settings.get(i.id, I)
}, v = () => {
  R = game.settings.get(i.id, H).split(/\\s*,\\s*/), T = game.settings.get(i.id, $).split(/\\s*,\\s*/);
};
Hooks.once("init", async () => {
  for (const [e, n] of Object.entries(r))
    await game.settings.register(i.id, e, n);
  v(), Hooks.on("closeSettingsConfig", v);
});
const p = (e) => {
  try {
    let n = new Roll(`1d20 + ${e - 12}`);
    console.log(n.evaluate({ async: !1 })), n.toMessage(
      {
        user: game.user._id,
        speaker: "GM",
        content: `DC ${e}, result ${n.total}`,
        whisper: ChatMessage.getWhisperRecipients("GM")
      },
      { rollMode: "gmroll" }
    );
  } catch (n) {
    console.log("Failed roll " + n);
  }
}, P = (e) => {
  let n = e.find("input[name='dc_value']"), t = parseInt(n.val());
  p(t);
}, B = (e) => ({
  icon: "<i class='fas fa-check'></i>",
  label: `DC ${e}`,
  callback: () => p(e)
}), A = ({ buttons: e, options: n = {} }) => {
  e = {
    ...e,
    ...n.showInput && {
      roll: {
        icon: "<i class='fas fa-check'></i>",
        label: "Roll",
        callback: P.bind(globalThis)
      }
    },
    end: {
      label: "Cancel"
    }
  }, new Dialog({
    title: "Convert DC to Roll",
    ...n.showInput && {
      content: `<form>
        <div class="form-group">
          <label>DC</label>
          <input type='text' name='dc_value'></input>
        </div>
      </form>`
    },
    buttons: e,
    default: "yes"
  }).render(!0);
}, j = () => {
  D(12, 14, 15, 16, 18);
}, D = (...e) => {
  let n = {};
  for (const t of e)
    n = { ...n, [`dcButton${t}`]: B(t) };
  A({ buttons: n, options: { showInput: !0 } });
};
window[hazardSummons] = window[hazardSummons] || {};
window[hazardSummons] = {
  ...window[hazardSummons] || {},
  dcBasic: j,
  dcList: D,
  dcToCheck: p,
  dcDialog: A
};
const C = (e, n, t, s, o) => {
  let a = {
    type: e,
    sceneId: n,
    templateId: t,
    hookName: s,
    hookIndex: o
  };
  return u.info(`Created aura: ${JSON.stringify(a, null, 2)}`), a;
}, E = (e, n, t = !0) => e && e.items.find((s) => t ? s.name == n : s.name.includes(n)), z = (e) => {
  for (const n in h.getEnhancedSummonerTags())
    return !!E(e, n, !1);
}, U = (e) => {
  for (const n in h.getPowerfulSummonsTags())
    return !!E(e, n, !1);
}, G = (e, n) => {
  var t, s;
  return ((s = (t = e == null ? void 0 : e.flags[i.flag]) == null ? void 0 : t.spiritAura) == null ? void 0 : s.type) == n;
}, _ = (e) => {
  var t;
  let n = (t = e == null ? void 0 : e.labels) == null ? void 0 : t.derivedDamage;
  return n ? n.filter((s) => s.damageType == "healing").length > 0 : !1;
}, w = (e) => {
  var t, s, o;
  let n = (o = (s = (t = e == null ? void 0 : e.classes) == null ? void 0 : t.druid) == null ? void 0 : s.system) == null ? void 0 : o.levels;
  return n || 0;
}, q = /(?<hd>\d+)d(\d+)/, J = (e) => {
  let n = e.match(q), t = 0;
  return n && (t = parseInt(n[1])), t;
}, V = (e) => {
  let n = e.system.attributes.hp, t = 2 * J(n.formula), s = t + n.value;
  e.system.attributes.hp.value = s, e.system.attributes.hp.max = s, W(e), console.log(`Granting ${e.id}:${e.name} ${t} HP`);
}, W = (e) => {
  e.items.filter((n) => n.type == "weapon").forEach((n) => {
    Object.assign(n.flags, {
      midiProperties: { magicdam: !0, fulldam: !0 }
    });
  });
}, L = ({ updates: e, sourceData: n }) => {
  var o;
  let t = e.actor, s = game.actors.get(n.summonerTokenDocument.actorId);
  z(s) && ((o = t.flags[i.id]) != null && o.summoned || (t.flags[i.id] = {
    summoned: !0,
    summonerLevel: w(s)
  }, t.name = `Summoned ${t.name}`, e.token.name = t.name, U(s) && V(t)));
}, Y = (e, n) => {
  e.filter((t) => {
    var s, o;
    return !((o = (s = t.system) == null ? void 0 : s.attributes) != null && o.hp.temp) || 0 < n;
  }).forEach((t) => {
    t.update({ system: { attributes: { hp: { temp: n } } } });
  });
}, K = (e) => {
  var a, l;
  let n = e.flags[i.flag].spiritAura, t = (l = (a = game.scenes.get(n.sceneId)) == null ? void 0 : a.templates) == null ? void 0 : l.get(n.templateId);
  if (!t)
    return;
  let s = F(t, O), o = w(e);
  s.forEach((m) => {
    let d = m.system.attributes.hp;
    o = Math.min(d.max - d.value, o), u.info(`Aura healed ${m.name} for ${o}`), m.update({
      system: { attributes: { hp: { value: d.value + o } } }
    });
  });
}, Q = (e) => {
  var o, a;
  let n = e == null ? void 0 : e.sceneId, t = e == null ? void 0 : e.templateId;
  e != null && e.hookIndex && Hooks.off(e.hookName, e == null ? void 0 : e.hookIndex);
  let s = (a = (o = game.scenes.get(n)) == null ? void 0 : o.templates) == null ? void 0 : a.get(t);
  s && s.delete();
}, X = (e, n, t) => {
  M(e, n, t, f.STRENGTH);
}, Z = (e, n, t) => {
  M(e, n, t, f.HEALING);
}, M = async (e, n, t, s) => {
  var y;
  n = game.actors.get(n == null ? void 0 : n.id);
  const o = {
    t: "circle",
    user: game.userId,
    distance: h.getAuraRadius(),
    direction: 45,
    x: 1e3,
    y: 1e3,
    fillColor: game.user.color
  }, a = new MeasuredTemplateDocument(o, {
    parent: canvas.scene
  });
  n && Q((y = n.flags[i.id]) == null ? void 0 : y.spiritAura);
  const l = new game.dnd5e.canvas.AbilityTemplate(a);
  let [m] = await l.drawPreview(), d;
  s == f.HEALING ? d = N(m) : s == f.STRENGTH && (d = ee(n, m)), g(n, d);
}, x = (e) => {
  G(e.actor, f.HEALING) && _(e.item) && K(e.actor);
}, N = (e) => {
  u.info(`setupHealingAura template: ${e.id}`);
  let n = "midi-qol.RollComplete", t = Hooks.on(n, x);
  return C(
    f.HEALING,
    e.parent.id,
    e.id,
    n,
    t
  );
}, ee = (e, n) => {
  u.info(`setupStrengthAura actor:${e.id}, template: ${n.id}`);
  const t = () => {
    try {
      Hooks.off("refreshMeasuredTemplate", t);
      let s = F(n, O);
      Y(s, w(e) + 5);
    } catch (s) {
      console.log(`Error while checking contents of aura: ${s.message}`);
    }
  };
  return Hooks.on("refreshMeasuredTemplate", t), C(f.STRENGTH, n.parent.id, n.id);
}, O = (e) => {
  var n;
  return ((n = e.flags[i.id]) == null ? void 0 : n.summoned) || e.type == "character";
}, F = (e, n = () => !0) => {
  const t = e.parent.tokens;
  let s = game.modules.get("templatemacro").api.findContained(e);
  u.debug(`Found ${s.length} tokens in aura ${e.id}`);
  let o = [];
  return s && s.forEach((a) => {
    n(t.get(a).actor) && o.push(t.get(a).actor);
  }), o;
};
Hooks.once("init", () => {
  Hooks.on("fs-preSummon", L);
});
Hooks.once("renderApplication", () => {
  game.actors.forEach((e) => {
    var s, o, a;
    if (u.debug(
      `${e.name}:${e.id} spirit aura: ${(s = e.flags[i.flag]) == null ? void 0 : s.spiritAura}`
    ), !G(e, f.HEALING))
      return;
    let n = e.flags[i.flag].spiritAura;
    u.info(`Found spiritAura data on actor:${e.id}: ${n}`);
    let t = (a = (o = game.scenes.get(n.sceneId)) == null ? void 0 : o.templates) == null ? void 0 : a.get(n.templateId);
    t ? (n = N(t), g(e, n)) : g(e, {});
  });
});
const g = (e, n) => {
  let t = { flags: {} };
  t.flags[i.flag] = { spiritAura: n }, u.info(
    `Updating ${e.name}:${e.id}: ${JSON.stringify(t, null, 2)}`
  ), e.update(t);
};
window[i.window] = window[i.window] || {};
window[i.window] = {
  ...window[i.window] || {},
  cotsBearAura: X,
  cotsModifySummon: L,
  cotsUnicornAura: Z
};
const ne = [
  {
    name: "Summonable",
    function: (e) => e.filter(
      (n) => n.system.details.cr <= 2 && !n.name.toLowerCase().includes("swarm")
    )
  },
  {
    name: "Positive CR",
    function: (e) => e.filter((n) => n.system.details.cr > 0)
  }
], te = [
  {
    category: "CR",
    filters: [
      {
        name: "&frac18;",
        function: (e) => {
          var n, t;
          return ((t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.details) == null ? void 0 : t.cr) == 0.125;
        }
      },
      {
        name: "&frac14;",
        function: (e) => {
          var n, t;
          return ((t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.details) == null ? void 0 : t.cr) == 0.25;
        }
      },
      {
        name: "&frac12;",
        function: (e) => {
          var n, t;
          return ((t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.details) == null ? void 0 : t.cr) == 0.5;
        }
      },
      {
        name: "1",
        function: (e) => {
          var n, t;
          return ((t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.details) == null ? void 0 : t.cr) == 1;
        }
      },
      {
        name: "2",
        function: (e) => {
          var n, t;
          return ((t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.details) == null ? void 0 : t.cr) == 2;
        }
      }
    ]
  },
  {
    category: "Type",
    filters: [
      {
        name: "Fey",
        function: (e) => {
          var n, t;
          return ((t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.details) == null ? void 0 : t.type.value) == "fey";
        }
      },
      {
        name: "Beast",
        function: (e) => {
          var n, t;
          return ((t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.details) == null ? void 0 : t.type.value) == "beast";
        }
      },
      {
        name: "Elementals",
        function: (e) => {
          var n, t;
          return ((t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.details) == null ? void 0 : t.type.value) == "elemental";
        }
      }
    ]
  },
  {
    category: "Move",
    filters: [
      {
        name: "Walk",
        function: (e) => {
          var n, t;
          return (t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.attributes) == null ? void 0 : t.movement.walk;
        }
      },
      {
        name: "Fly",
        function: (e) => {
          var n, t;
          return (t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.attributes) == null ? void 0 : t.movement.fly;
        }
      },
      {
        name: "Burrow",
        function: (e) => {
          var n, t;
          return (t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.attributes) == null ? void 0 : t.movement.burrow;
        }
      },
      {
        name: "Swim",
        function: (e) => {
          var n, t;
          return (t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.attributes) == null ? void 0 : t.movement.swim;
        }
      }
    ]
  },
  {
    category: "Vision",
    filters: [
      {
        name: "Darkvision",
        function: (e) => {
          var n, t;
          return (t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.attributes) == null ? void 0 : t.senses.darkvision;
        }
      },
      {
        name: "Blindsight",
        function: (e) => {
          var n, t;
          return (t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.attributes) == null ? void 0 : t.senses.blindsight;
        }
      },
      {
        name: "Tremorsense",
        function: (e) => {
          var n, t;
          return (t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.attributes) == null ? void 0 : t.senses.tremorsense;
        }
      },
      {
        name: "Truesight",
        function: (e) => {
          var n, t;
          return (t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.attributes) == null ? void 0 : t.senses.truesight;
        }
      }
    ]
  }
], se = (e) => {
  var t, s;
  let n = ((s = (t = e == null ? void 0 : e.system) == null ? void 0 : t.details) == null ? void 0 : s.cr) || "-";
  return n === 0.125 && (n = "&frac18;"), n === 0.25 && (n = "&frac14;"), n === 0.5 && (n = "&frac12;"), n;
}, oe = (e, n) => {
  var t, s, o, a;
  return ((s = (t = e == null ? void 0 : e.system) == null ? void 0 : t.details) == null ? void 0 : s.cr) - ((a = (o = n == null ? void 0 : n.system) == null ? void 0 : o.details) == null ? void 0 : a.cr);
}, ae = (e, n) => (e.atkRating === void 0 && LOG.warn(`${e.name} maxToHit not indexed.`), n.atkRating === void 0 && LOG.warn(`${n.name} maxToHit not indexed.`), LOG.debug(`${e.name}(${e.atkRating}) - ${n.name}(${n.atkRating})`), n.atkRating - e.atkRating), c = [];
Hooks.once("ready", () => {
  let e = foundrySummons.columnDefinition;
  c.push(e("name", (n) => n.name)), c.push(
    e("hp", (n) => {
      var t, s, o;
      return ((o = (s = (t = n.system) == null ? void 0 : t.attributes) == null ? void 0 : s.hp) == null ? void 0 : o.value) || "-";
    })
  ), c.push(
    e(
      "Rating",
      (n) => n.atkRating || "-",
      ae
    )
  ), c.push(e("Hit", (n) => n.atkHit || "-")), c.push(e("Dmg", (n) => n.atkDmg || "-")), c.push(e("CR", se, oe));
});
console.log("importing enhanced menu");
console.log("importing enhanced menu");
const ie = (e) => {
  let n = ue(e), t = e.items.filter((a) => a.name == "Multiattack").length > 0, s = n / 20 * t ? 1.5 : 1, o = b(e);
  return { hit: n, dmg: o, rating: Math.ceil(s * b(e)) };
}, b = (e) => {
  var s;
  let n = e == null ? void 0 : e.items.filter(
    (o) => {
      var a, l;
      return (o == null ? void 0 : o.type) == "weapon" && ((l = (a = o == null ? void 0 : o.labels) == null ? void 0 : a.derivedDamage) == null ? void 0 : l[0]);
    }
  ), t = 0;
  for (const o of n)
    for (const a of ((s = o == null ? void 0 : o.labels) == null ? void 0 : s.derivedDamage) || []) {
      let l = de(a.formula);
      l > t && (t = l);
    }
  return t;
}, le = /(?<count>\d+)d(?<die>\d+)\s*(?<op>[-+])?\s*(?<mod>\d+)?/, me = /(?<value>\d+)/, de = (e) => {
  let n = le.exec(e);
  if (!n)
    return n = me.exec(e), n ? n.groups.value : 0;
  const { count: t, die: s, op: o, mod: a } = n.groups;
  let l = Math.ceil(t * s / 2), m = Number(a || 0);
  return o == "-" && (l -= m), (!o || o == "+") && (l += m), l;
}, ue = (e) => {
  let n = e == null ? void 0 : e.items.filter(
    (s) => {
      var o, a, l;
      return (s == null ? void 0 : s.type) == "weapon" && ((o = s == null ? void 0 : s.labels) == null ? void 0 : o.toHit) && ((l = (a = s == null ? void 0 : s.labels) == null ? void 0 : a.derivedDamage) == null ? void 0 : l[0]);
    }
  ), t = 0;
  for (const s of n) {
    let o = parseInt(s.labels.toHit.replaceAll(" ", ""));
    o && o > t && (t = o);
  }
  return t;
}, fe = () => {
  const e = {
    filters: ne,
    filterGroups: te,
    columns: c,
    options: {
      defaultFilters: !1,
      defaultSorting: !1
    }
  };
  foundrySummons.openMenu(e);
}, ce = (e, n) => {
  let t = n.lastIndexOf("."), s = n.slice(0, t), o = n.slice(t + 1);
  if (!e[s]) {
    let a = s.replace("Compendium.", "").replace(".Actor", "");
    e[s] = game.packs.get(a);
  }
  return [e[s], o];
};
Hooks.once("ready", () => {
  Hooks.on("fs-loadingPacks", async (e) => {
    let n = {};
    for (const t of e) {
      const [s, o] = ce(n, t.id);
      if (s) {
        let a = await s.getDocument(o);
        const { hit: l, dmg: m, rating: d } = ie(a);
        t.atkRating = d, t.atkHit = l, t.atkDmg = m;
      } else
        u.error(`Missing pack data for ${t.id}`);
    }
  });
});
window[i.window] = window[i.window] || {};
window[i.window] = {
  ...window[i.window] || {},
  openMenu: fe
};
//# sourceMappingURL=index.js.map
