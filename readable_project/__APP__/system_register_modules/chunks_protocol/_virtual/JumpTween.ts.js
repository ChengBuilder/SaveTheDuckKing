/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/JumpTween.ts")
 */

System.register('chunks:///_virtual/JumpTween.ts', ['cc'], function (e) {
  var t, n, i, o;
  return {
    setters: [
      function (e) {
        ((t = e.cclegacy), (n = e.Vec3), (i = e.tween), (o = e.easing));
      }
    ],
    execute: function () {
      (e('jumpTo', function (e, t, r, a, s, l) {
        void 0 === l && (l = { easing: 'smooth' });
        var c = new n(),
          u = i(e),
          d = 2 * a;
        e.jumpY = 0;
        var h = 0,
          p = i()
            .to(
              s / d,
              { jumpY: r },
              {
                onStart: function (e) {
                  ((h = e.position.y), (e.jumpY = 0));
                },
                onUpdate: function (e, t) {
                  (c.set(e.position), (c.y = h + e.jumpY), (e.position = c));
                },
                onComplete: function (e) {
                  e.jumpY = 0;
                },
                easing: 'quadOut'
              }
            )
            .to(
              s / d,
              { jumpY: r },
              {
                onStart: function (e) {
                  h = e.position.y;
                },
                onUpdate: function (e, t) {
                  (c.set(e.position), (c.y = h - e.jumpY), (e.position = c));
                },
                onComplete: function (e) {
                  e.jumpY = 0;
                },
                easing: 'quadIn'
              }
            )
            .union()
            .repeat(a);
        e.jumpOffsetY = 0;
        var f = 0,
          g = i().to(
            s,
            { jumpOffsetY: t.y - e.position.y },
            {
              onStart: function (e) {
                ((f = t.y - e.position.y), (e.jumpOffsetY = 0));
              },
              onUpdate: function (e, t) {
                var n = o.quadOut(t) * f;
                (c.set(e.position), (c.y += n), (e.position = c));
              },
              onComplete: function (e) {
                e.jumpOffsetY = 0;
              },
              easing: 'quadOut'
            }
          );
        ((e.jumpX = e.position.x), (e.jumpZ = e.position.z));
        var m = i().to(
          s,
          { jumpX: t.x, jumpZ: t.z },
          {
            onStart: l.onStart,
            onUpdate: function (e, t) {
              (c.set(e.position),
                (c.x = e.jumpX),
                (c.z = e.jumpZ),
                (e.position = c),
                null == l.onUpdate || l.onUpdate());
            },
            onComplete: function (e) {
              ((e.jumpX = e.position.x),
                (e.jumpZ = e.position.z),
                null == l.onComplete || l.onComplete());
            }
          }
        );
        return (u.parallel(p, g, m), u);
      }),
        t._RF.push({}, 'c7a4eiRKw1PPpwajl1vcEKh', 'JumpTween', void 0),
        t._RF.pop());
    }
  };
});
