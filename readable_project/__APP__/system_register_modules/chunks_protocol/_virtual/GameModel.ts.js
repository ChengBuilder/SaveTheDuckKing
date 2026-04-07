/**
 * Extracted from game.js.
 * Parent define module: assets/start-scene/index.b370a.js
 * System.register("chunks:///_virtual/GameModel.ts")
 */

System.register(
  'chunks:///_virtual/GameModel.ts',
  [
    './rollupPluginModLoBabelHelpers.js',
    'cc',
    './BoardLayout.ts',
    './DefaultRowCounts.ts',
    './LevelMechanismManager.ts',
    './EventManager.ts',
    './Enum.ts'
  ],
  function (e) {
    var t, n, i, o, r, a, s, l, c, u, d, h, p;
    return {
      setters: [
        function (e) {
          ((t = e.extends), (n = e.createForOfIteratorHelperLoose));
        },
        function (e) {
          i = e.cclegacy;
        },
        function (e) {
          ((o = e.validateRowCountsWithinSlots),
            (r = e.buildRowSlotColsFromRowCounts),
            (a = e.validateRowCountsFullScreenMessy));
        },
        function (e) {
          s = e.computeDefaultRowCounts;
        },
        function (e) {
          ((l = e.isShapeMechanism),
            (c = e.LevelMechanismManager),
            (u = e.validateRowCountsParity),
            (d = e.DEFAULT_FRUIT_HOLE_RESERVE));
        },
        function (e) {
          h = e.default;
        },
        function (e) {
          p = e.EVENT_KEYS;
        }
      ],
      execute: function () {
        i._RF.push({}, '13f3c7WWlFM8rcwymfCAPvd', 'GameModel', void 0);
        var f = e('ROW_HOLE_BOARD_ID_BASE', 10001),
          g = e('PAIR_SEGMENT_WEIGHTS', [20, 20, 35, 25]),
          m = e('PAIR_SEGMENT_ID_CAPS', [4, 8, 13, 30]);
        function v() {
          if (g.length !== m.length)
            throw new Error(
              '[GameModel] PAIR_SEGMENT_WEIGHTS 与 PAIR_SEGMENT_ID_CAPS 长度须一致（当前 ' +
                g.length +
                ' vs ' +
                m.length +
                '）'
            );
        }
        function y(e, t) {
          var n = t.length;
          if (0 === n || e <= 0) return new Array(Math.max(0, n)).fill(0);
          var i = t.map(function (e) {
              return Math.max(0, Number(e));
            }),
            o = i.reduce(function (e, t) {
              return e + t;
            }, 0);
          if (o <= 0) return new Array(n).fill(0);
          for (var r = [], a = 0, s = 0; s < n - 1; s++) {
            var l = Math.floor((e * i[s]) / o);
            (r.push(l), (a += l));
          }
          if ((r.push(e - a), e >= 1 && 0 === r[0])) {
            r[0] = 1;
            for (var c = n - 1; c >= 0 && 0 === r[c]; ) c--;
            if (c >= 0 && r[c] > 0) r[c]--;
            else {
              for (var u = 0, d = 1; d < n; d++) r[d] > r[u] && (u = d);
              r[u] > 0 && r[u]--;
            }
          }
          return r;
        }
        function _(e, t, n) {
          for (var i = n - 1; i > t; i--) {
            var o = t + Math.floor(Math.random() * (i - t + 1)),
              r = [e[o], e[i]];
            ((e[i] = r[0]), (e[o] = r[1]));
          }
        }
        function b(e, t) {
          v();
          for (var n = y(Math.floor(t / 2), g), i = 0, o = 0; o < n.length; o++) {
            var r = 2 * n[o];
            if (!(r <= 0)) {
              var a = i + r;
              (_(e, i, a), (i = a));
            }
          }
        }
        function S(e, t) {
          v();
          for (var n = [], i = y(Math.floor(e / 2), g), o = m, r = 0; r < i.length; r++)
            for (
              var a = o[r], s = a < 0 ? t : a, l = Math.max(1, Math.min(s, t)), c = i[r], u = 0;
              u < c;
              u++
            ) {
              var d = 1 + Math.floor(Math.random() * l);
              n.push(d, d);
            }
          return n;
        }
        var C = {
          1: { maxFruit: 2, totalFruits: 8 },
          2: { maxFruit: 20, totalFruits: 48 },
          3: { maxFruit: 34, totalFruits: 108 },
          4: { maxFruit: 34, totalFruits: 158 },
          5: { maxFruit: 34, totalFruits: 208 },
          6: { maxFruit: 34, totalFruits: 128 },
          7: { maxFruit: 34, totalFruits: 228 },
          8: { maxFruit: 34, totalFruits: 238 },
          9: { maxFruit: 34, totalFruits: 248 },
          10: { maxFruit: 34, totalFruits: 248 }
        };
        (e(
          'GameModel',
          (function () {
            function e(e) {
              ((this.visibleLayers = 15),
                (this.currentLevel = 1),
                (this.gameState = 'none'),
                (this.lastLoseKind = null),
                (this.failThreshold = 6),
                (this.board = []),
                (this._rowCounts = []),
                (this._rowSlotCols = []),
                (this._rowSlotLocalXs = null),
                (this._fruitSlotLocalPos = null),
                (this._fullScreenLayoutMode = 'none'),
                (this._ids = []),
                (this._holeIdsL = []),
                (this._holeIdsR = []),
                (this._holeReserveTotal = 0),
                (this._rowHoleQueues = []),
                (this._rowHoleCells = []),
                (this._blindBoxMask = []),
                (this._blindBoxBoard = []),
                (this._levelMechanism = null),
                (this._gridHorizontalSpacing = null),
                (this._pendingBoardShapeResolved = null),
                (this._totalFruitsHudEffective = 0),
                (this.currentLevel = e));
            }
            var i = e.prototype;
            return (
              (i.setLevelMechanism = function (e) {
                this._levelMechanism = e;
              }),
              (i.setPendingBoardShapeResolved = function (e) {
                this._pendingBoardShapeResolved = e;
              }),
              (i.getLevelConfig = function () {
                var e,
                  t,
                  n = (t = this.currentLevel) <= 1 ? 1 : t >= 10 ? 10 : t;
                return null != (e = C[n]) ? e : null;
              }),
              (i.getLevelTotalFruits = function () {
                var e,
                  t,
                  n = this._totalFruitsHudEffective;
                return n > 0
                  ? n
                  : null != (e = null == (t = this.getLevelConfig()) ? void 0 : t.totalFruits)
                    ? e
                    : 0;
              }),
              (i.setLevel = function (e) {
                var t = Math.floor(Number(e));
                (Number.isFinite(t) || (t = 1), (this.currentLevel = Math.max(1, t)));
              }),
              (i.toNextLevel = function () {
                this.currentLevel += 1;
              }),
              (i.setGameState = function (e, t, n) {
                ((this.gameState = e),
                  'win' === e
                    ? ((this.lastLoseKind = null), console.log('游戏结束：成功'))
                    : 'lose' === e
                      ? ((this.lastLoseKind =
                          null != n
                            ? n
                            : null != t && t.includes('失败阈值')
                              ? 'slot_full'
                              : null != t && t.includes('无法继续')
                                ? 'dead_end'
                                : null),
                        console.log('游戏结束：失败', null != t && '' !== t ? '| ' + t : ''))
                      : (this.lastLoseKind = null),
                  ('win' !== e && 'lose' !== e) || h.instance.emit(p.GAME_END, 'win' === e, t));
              }),
              (i.reset = function () {
                ((this.gameState = 'playing'),
                  (this.lastLoseKind = null),
                  this._buildBoard(0),
                  this._printBoard());
              }),
              (i.getFruitIdList = function () {
                return this.board;
              }),
              (i.syncBoardRow = function (e, t) {
                if (e < 0 || e >= this.board.length) return !1;
                var n = this.board[e];
                if (!n) return !1;
                if (t.length > n.length)
                  return (
                    console.warn(
                      '[GameModel] syncBoardRow ids 长于 board 列数 row=',
                      e,
                      'boardLen=',
                      n.length,
                      'idsLen=',
                      t.length
                    ),
                    !1
                  );
                for (var i = 0; i < t.length; i++) n[i] = t[i];
                return !0;
              }),
              (i.getTotalRowCount = function () {
                return this._rowCounts.length;
              }),
              (i.getRowSlotCols = function (e) {
                var t;
                return e < 0 || e >= this._rowSlotCols.length
                  ? []
                  : null != (t = this._rowSlotCols[e])
                    ? t
                    : [];
              }),
              (i.getRowSlotLocalXs = function (e) {
                if (!this._rowSlotLocalXs) return null;
                if (e < 0 || e >= this._rowSlotLocalXs.length) return null;
                var t = this._rowSlotLocalXs[e];
                return null != t && t.length ? t.slice() : null;
              }),
              (i.getFruitSlotLocalPosRow = function (e) {
                if (!this._fruitSlotLocalPos) return null;
                if (e < 0 || e >= this._fruitSlotLocalPos.length) return null;
                var t = this._fruitSlotLocalPos[e];
                return null != t && t.length
                  ? t.map(function (e) {
                      return { x: e.x, y: e.y };
                    })
                  : null;
              }),
              (i.isFullScreenMessyLayout = function () {
                return 'messy' === this._fullScreenLayoutMode;
              }),
              (i.isFixedShapeNoLayerDrop = function () {
                var e;
                return 'fixed_shape' === (null == (e = this._levelMechanism) ? void 0 : e.kind);
              }),
              (i.getGridHorizontalSpacing = function () {
                return this._gridHorizontalSpacing;
              }),
              (i.getGridVerticalSpacing = function () {
                var e = this._levelMechanism;
                if (!e) return null;
                var t = e.gridVerticalSpacing;
                return null != t && Number.isFinite(t) ? t : null;
              }),
              (i.getHoleIdsLeft = function () {
                return this._holeIdsL.slice();
              }),
              (i.getHoleIdsRight = function () {
                return this._holeIdsR.slice();
              }),
              (i.getHoleReserveTotal = function () {
                return this._holeReserveTotal;
              }),
              (i.isRowHoleBoardId = function (e) {
                return e >= f && e < f + 512;
              }),
              (i.rowHoleIndexFromBoardId = function (e) {
                return e - f;
              }),
              (i.takeRowHoleNextDisplayId = function (e) {
                var t,
                  n = this._rowHoleQueues[e];
                return null != n && n.length && null != (t = n.shift()) ? t : null;
              }),
              (i.restoreRowHoleFrontDisplayId = function (e, t) {
                var n = this._rowHoleQueues[e];
                n && n.unshift(t);
              }),
              (i.hasRowHoleQueue = function (e) {
                var t, n;
                return (
                  (null != (t = null == (n = this._rowHoleQueues[e]) ? void 0 : n.length) ? t : 0) >
                  0
                );
              }),
              (i.getRowHoleQueueRemainingCount = function (e) {
                var t, n;
                return null != (t = null == (n = this._rowHoleQueues[e]) ? void 0 : n.length)
                  ? t
                  : 0;
              }),
              (i.getRowHoleCell = function (e) {
                return this._rowHoleCells[e] ? t({}, this._rowHoleCells[e]) : null;
              }),
              (i.getRowHoleQueueRemainingTotal = function () {
                for (var e, t = 0, i = n(this._rowHoleQueues); !(e = i()).done; )
                  t += e.value.length;
                return t;
              }),
              (i.hasRowFruitHoleData = function () {
                return this._rowHoleCells.length > 0;
              }),
              (i.getRowHoleCount = function () {
                return this._rowHoleCells.length;
              }),
              (i.getRopeMaxCount = function () {
                var e = this._levelMechanism;
                if (!e || !l(e)) return 0;
                if ('default' !== e.shape) return 0;
                var t = e.ropeMaxCount;
                return null == t || t <= 0 ? 0 : Math.min(255, Math.floor(t));
              }),
              (i._getEffectiveMechanism = function () {
                var e = this._levelMechanism;
                return e
                  ? 'fruit_hole' === e.kind || 'row_fruit_hole' === e.kind
                    ? { kind: 'standard', shape: e.shape, centerFillBase: e.centerFillBase }
                    : e
                  : null;
              }),
              (i._resolveLayout = function (e, t) {
                var n = this._getEffectiveMechanism();
                if (n) {
                  var i = c.resolveBoardShape(n, e, t);
                  if (
                    i &&
                    i.rowCounts.reduce(function (e, t) {
                      return e + t;
                    }, 0) === e
                  )
                    return i;
                  if (!l(n) || 'standard' !== n.kind || 'default' !== n.shape) return null;
                }
                var a = s(e);
                return a.reduce(function (e, t) {
                  return e + t;
                }, 0) === e &&
                  u(a) &&
                  o(a)
                  ? { rowCounts: a.slice(), rowSlotCols: r(a) }
                  : null;
              }),
              (i.getBlindBoxAt = function (e, t) {
                var n, i;
                return null != (n = null == (i = this._blindBoxBoard[e]) ? void 0 : i[t]) && n;
              }),
              (i.ensureRowsUpTo = function (e) {
                var t = this.board.length;
                if (e < t - 1) return [];
                for (var n = 0, i = 0; i < t; i++) n += this.board[i].length;
                for (var o = [], r = t; r <= e && r < this._rowCounts.length; r++) {
                  for (
                    var a = this._rowCounts[r], s = [], l = [], c = 0;
                    c < a && n < this._ids.length;
                    c++
                  ) {
                    var u;
                    (s.push(this._ids[n]), l.push(null != (u = this._blindBoxMask[n]) && u), n++);
                  }
                  (this.board.push(s), this._blindBoxBoard.push(l), o.push(s));
                }
                return o;
              }),
              (i._globalCellIndexToRowCol = function (e, t) {
                for (var n = 0, i = 0; i < e.length; i++) {
                  var o = e[i];
                  if (t < n + o) return { row: i, col: t - n };
                  n += o;
                }
                return { row: 0, col: 0 };
              }),
              (i._computeRowHolePlacementIndices = function (e, t) {
                var n = Math.max(0, Math.floor(e * t));
                if (n <= 0 || e <= 20) return [];
                for (var i = [], o = 20; i.length < n && o < e; )
                  (i.push(o), (o += 20 + Math.floor(11 * Math.random())));
                return i;
              }),
              (i._buildRowFruitHoleIds = function (e, t, n) {
                for (
                  var i,
                    o,
                    r,
                    a = this._levelMechanism,
                    s = Math.min(1, Math.max(0, null != (i = a.rowHoleFruitRatio) ? i : 0.05)),
                    l = Math.max(1, Math.floor(null != (o = a.rowHoleInnerCount) ? o : 5)),
                    c = this._computeRowHolePlacementIndices(e, s),
                    u = l;
                  c.length > 0 && 0 != (e + u * (r = c.length) - r) % 2;
                )
                  c.pop();
                if (0 === c.length && l % 2 == 1) {
                  var d = this._computeRowHolePlacementIndices(e, s);
                  d.length >= 1 && ((c = [d[0]]), (u = l + 1));
                }
                var h = e + u * c.length - c.length;
                if (h < 2) return null;
                var p = S(h, t);
                b(p, h);
                var g = new Set(c),
                  m = new Array(e),
                  v = 0,
                  y = 0;
                ((this._rowHoleQueues = []), (this._rowHoleCells = []));
                for (var _ = 0; _ < e; _++)
                  g.has(_)
                    ? ((m[_] = f + y),
                      this._rowHoleQueues.push(p.slice(v, v + u)),
                      (v += u),
                      this._rowHoleCells.push(this._globalCellIndexToRowCol(n, _)),
                      y++)
                    : ((m[_] = p[v]), v++);
                return v !== h
                  ? (console.warn('[GameModel] row_fruit_hole 池指针异常', v, h),
                    (this._rowHoleQueues = []),
                    (this._rowHoleCells = []),
                    null)
                  : ((this._totalFruitsHudEffective = h), m);
              }),
              (i._buildBoard = function (e) {
                var t, n;
                void 0 === e && (e = 0);
                var i = this.getLevelConfig();
                if (i) {
                  var o = i.maxFruit,
                    a = i.totalFruits;
                  ((this._totalFruitsHudEffective = a),
                    (this._gridHorizontalSpacing = null),
                    (this._fruitSlotLocalPos = null),
                    (this._fullScreenLayoutMode = 'none'),
                    (this._holeIdsL = []),
                    (this._holeIdsR = []),
                    (this._holeReserveTotal = 0),
                    (this._rowHoleQueues = []),
                    (this._rowHoleCells = []));
                  var u = this._pendingBoardShapeResolved;
                  this._pendingBoardShapeResolved = null;
                  var h =
                      null != u
                        ? u
                        : this._levelMechanism
                          ? c.resolveBoardShape(this._levelMechanism, a, o)
                          : null,
                    p = 0,
                    g = a,
                    m = null;
                  if (
                    'fruit_hole' === (null == (t = this._levelMechanism) ? void 0 : t.kind) &&
                    !(null != h && h.explicitIds && h.explicitIds.length > 0) &&
                    this._levelMechanism &&
                    l(this._levelMechanism)
                  ) {
                    var v = d,
                      y = this._levelMechanism.holeReserve;
                    if (
                      (null != y &&
                        (Number.isInteger(y) && y >= 2 && y % 2 == 0
                          ? (v = y)
                          : console.warn(
                              '[GameModel] fruit_hole holeReserve 须为偶数且 >=2，已使用默认',
                              d,
                              y
                            )),
                      a >= 24)
                    ) {
                      var _ = a - v;
                      if (_ >= 2 && _ % 2 == 0) {
                        var C = this._resolveLayout(_, o);
                        C
                          ? ((p = v), (g = _), (m = C))
                          : console.warn(
                              '[GameModel] fruit_hole 棋盘格数',
                              _,
                              '无法解析布局，洞未启用；可减小 holeReserve 或检查 shape'
                            );
                      } else
                        console.warn(
                          '[GameModel] fruit_hole totalFruits - holeReserve 须为 >=2 的偶数，洞未启用',
                          a,
                          v
                        );
                    }
                  }
                  var w,
                    N = null;
                  if (
                    (null != h && h.explicitIds && h.explicitIds.length > 0
                      ? ((N = h), (g = a), (p = 0))
                      : (N = p > 0 ? m : null != h ? h : this._resolveLayout(a, o)),
                    N)
                  ) {
                    var k;
                    ((w = N.rowCounts),
                      (this._rowSlotCols = N.rowSlotCols.map(function (e) {
                        return e.slice();
                      })),
                      (this._rowSlotLocalXs = N.rowSlotLocalXs
                        ? N.rowSlotLocalXs.map(function (e) {
                            return e.slice();
                          })
                        : null),
                      (this._fruitSlotLocalPos = N.fruitSlotLocalPos
                        ? N.fruitSlotLocalPos.map(function (e) {
                            return e.map(function (e) {
                              return { x: e.x, y: e.y };
                            });
                          })
                        : null));
                    var T,
                      B = N.horizontalSpacing,
                      A = null == (k = this._levelMechanism) ? void 0 : k.gridHorizontalSpacing,
                      P = null != B ? B : A;
                    (null != P && Number.isFinite(P) && P >= 0 && (this._gridHorizontalSpacing = P),
                      this._rowSlotLocalXs &&
                        (this._fullScreenLayoutMode =
                          null != (T = N.fullScreenLayoutMode) ? T : 'messy'));
                  } else
                    ((w = s(g)),
                      (this._rowSlotCols = r(w)),
                      (this._rowSlotLocalXs = null),
                      (this._fruitSlotLocalPos = null));
                  var M = w.reduce(function (e, t) {
                      return e + t;
                    }, 0),
                    I = [],
                    F = null == (n = N) ? void 0 : n.explicitIds;
                  if (F && F.length === M) I = F.slice();
                  else {
                    if (
                      !this._levelMechanism ||
                      !l(this._levelMechanism) ||
                      'row_fruit_hole' !== this._levelMechanism.kind ||
                      (null != h && h.explicitIds && h.explicitIds.length > 0)
                    )
                      b((I = S(a, o)), a);
                    else {
                      var R = this._buildRowFruitHoleIds(M, o, w);
                      R && R.length === M
                        ? (I = R)
                        : (console.warn('[GameModel] row_fruit_hole id 生成失败，回退普通分段'),
                          b((I = S(a, o)), a),
                          (this._rowHoleQueues = []),
                          (this._rowHoleCells = []));
                    }
                    if (p > 0 && I.length === a) {
                      var L = p / 2;
                      this._holeReserveTotal = p;
                      var x = I.slice(-p);
                      ((this._holeIdsL = x.slice(0, L)),
                        (this._holeIdsR = x.slice(L)),
                        (this._ids = I.slice(0, g)));
                    } else this._ids = I;
                  }
                  if ((F && (this._ids = I), this._ids.length !== M))
                    return (
                      console.warn(
                        '[GameModel] ids 数量与 totalCells 不一致，将重建',
                        this._ids.length,
                        M
                      ),
                      void (e < 2 && this._buildBoard(e + 1))
                    );
                  ((this._rowCounts = w),
                    (this.board = []),
                    (this._blindBoxBoard = []),
                    (this._blindBoxMask = new Array(this._ids.length).fill(!1)));
                  var D = this._levelMechanism;
                  if ('blind_box' === (null == D ? void 0 : D.kind)) {
                    var G,
                      E = Math.min(1, Math.max(0, null != (G = D.blindBoxRatio) ? G : 0.05)),
                      O = Math.round(M * E),
                      H = Array.from({ length: M }, function (e, t) {
                        return t;
                      });
                    this._shuffle(H);
                    for (var V = 0; V < H.length && O > 0; V++) {
                      var U = H[V];
                      this._ids[U] >= f || ((this._blindBoxMask[U] = !0), O--);
                    }
                  }
                  !this._validateRowCounts(w) &&
                    e < 2 &&
                    (console.warn('[GameModel] 布局校验未通过，将重建'), this._buildBoard(e + 1));
                }
              }),
              (i._validateRowCounts = function (e) {
                var t = e.reduce(function (e, t) {
                  return e + t;
                }, 0);
                if (t % 2 != 0) return (console.warn('[GameModel] 校验失败：总数非偶数', t), !1);
                if (this._fruitSlotLocalPos) {
                  if (!a(e))
                    return (
                      console.warn(
                        '[GameModel] 校验失败：fixed_shape 场景节点某行超出全屏宽度可放上限',
                        e
                      ),
                      !1
                    );
                } else if (this._rowSlotLocalXs) {
                  if (!a(e))
                    return (
                      console.warn('[GameModel] 校验失败：全屏凌乱某行超出设计宽度可放上限', e),
                      !1
                    );
                } else if (!o(e))
                  return (console.warn('[GameModel] 校验失败：某行个数超过该行槽位上限', e), !1);
                if (this._rowSlotCols.length !== e.length)
                  return (
                    console.warn('[GameModel] 校验失败：rowSlotCols 行数与 rowCounts 不一致'),
                    !1
                  );
                for (var n = 0; n < e.length; n++) {
                  var i, r;
                  if (
                    (null != (i = null == (r = this._rowSlotCols[n]) ? void 0 : r.length)
                      ? i
                      : 0) !== e[n]
                  )
                    return (
                      console.warn(
                        '[GameModel] 校验失败：第' + n + '行槽位列数与 rowCounts 不一致'
                      ),
                      !1
                    );
                }
                if (this._rowSlotLocalXs) {
                  if (this._rowSlotLocalXs.length !== e.length)
                    return (
                      console.warn('[GameModel] 校验失败：rowSlotLocalXs 行数与 rowCounts 不一致'),
                      !1
                    );
                  for (var s = 0; s < e.length; s++) {
                    var l, c;
                    if (
                      (null != (l = null == (c = this._rowSlotLocalXs[s]) ? void 0 : c.length)
                        ? l
                        : 0) !== e[s]
                    )
                      return (
                        console.warn(
                          '[GameModel] 校验失败：第' + s + '行 localX 个数与 rowCounts 不一致'
                        ),
                        !1
                      );
                  }
                }
                if (this._fruitSlotLocalPos) {
                  if (this._fruitSlotLocalPos.length !== e.length)
                    return (
                      console.warn(
                        '[GameModel] 校验失败：fruitSlotLocalPos 行数与 rowCounts 不一致'
                      ),
                      !1
                    );
                  for (var u = 0; u < e.length; u++) {
                    var d, h;
                    if (
                      (null != (d = null == (h = this._fruitSlotLocalPos[u]) ? void 0 : h.length)
                        ? d
                        : 0) !== e[u]
                    )
                      return (
                        console.warn(
                          '[GameModel] 校验失败：第' +
                            u +
                            '行 fruitSlotLocalPos 个数与 rowCounts 不一致'
                        ),
                        !1
                      );
                  }
                }
                return !0;
              }),
              (i._shuffle = function (e) {
                for (var t = e.length - 1; t > 0; t--) {
                  var n = Math.floor(Math.random() * (t + 1)),
                    i = [e[n], e[t]];
                  ((e[t] = i[0]), (e[n] = i[1]));
                }
              }),
              (i._printBoard = function () {
                this.board.length > 0
                  ? this.board
                  : this._rowCounts.map(function (e) {
                      return [];
                    });
                for (var e = 0; e < Math.min(this._rowCounts.length, 20); e++) {
                  this._rowCounts[e];
                  var t = this.board[e];
                  null != t && t.length && t.join(',');
                }
              }),
              e
            );
          })()
        ),
          i._RF.pop());
      }
    };
  }
);
