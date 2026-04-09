"use strict";

/**
 * Refined module (manual): chunks:///_virtual/Util.ts
 * Source reference: restored/start-scene/Util.ts.restored.js
 * NOTE:
 * - This file is for semantic restoration/readability only.
 * - It is not loaded by the runtime bundle pipeline.
 * - `spawnFragmentEffect()` has a dedicated static audit now:
 *   architecture/docs/duck-fragment-usage-audit.md
 */

/**
 * @param {Record<string, any>} deps
 * deps.Sprite -> original "cc" Sprite
 * deps.tween -> original "cc" tween
 * deps.Color -> original "cc" Color
 * deps.instantiate -> original "cc" instantiate
 * deps.v3 -> original "cc" v3
 * deps.v2 -> original "cc" v2
 * deps.RigidBody2D -> original "cc" RigidBody2D
 * deps.ERigidBody2DType -> original "cc" ERigidBody2DType
 * deps.UIOpacity -> original "cc" UIOpacity
 * deps.warn -> original "cc" warn
 * deps.Component -> original "cc" Component
 * deps.UITransform -> original "cc" UITransform
 * deps.misc -> original "cc" misc
 * deps.Vec3 -> original "cc" Vec3
 * deps.Tween -> original "cc" Tween
 * deps.Node -> original "cc" Node
 * deps.ResManager -> original "./ResManager.ts" export
 * deps.AudioManager -> original "./AudioManager.ts" export
 * deps.GameModel -> original "./GameModel2.ts" export
 * deps.PoolManager -> original "./PoolManager.ts" export
 */
function createUtilModule(deps) {
  const Sprite = deps && deps.Sprite;
  const tween = deps && deps.tween;
  const Color = deps && deps.Color;
  const instantiate = deps && deps.instantiate;
  const v3 = deps && deps.v3;
  const v2 = deps && deps.v2;
  const RigidBody2D = deps && deps.RigidBody2D;
  const ERigidBody2DType = deps && deps.ERigidBody2DType;
  const UIOpacity = deps && deps.UIOpacity;
  const warn = deps && deps.warn;
  const ComponentBase = deps && deps.Component;
  const UITransform = deps && deps.UITransform;
  const misc = deps && deps.misc;
  const Vec3 = deps && deps.Vec3;
  const Tween = deps && deps.Tween;
  const NodeCtor = deps && deps.Node;
  const ResManager = deps && deps.ResManager;
  const AudioManager = deps && deps.AudioManager;
  const GameModel = deps && deps.GameModel;
  const PoolManager = deps && deps.PoolManager;

  class Util {
    static getRandomNum(min, max, integerOnly) {
      const shouldRound = integerOnly === undefined ? false : integerOnly;
      if (shouldRound) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
      return Math.random() * (max - min) + min;
    }

    static pickDistinctNumbersInRange(min, max, keepCount) {
      const values = [];
      for (let value = min; value <= max; value += 1) {
        values.push(value);
      }

      const removeCount = values.length - keepCount;
      for (let index = 0; index < removeCount; index += 1) {
        const randomIndex = Util.getRandomNum(0, values.length - 1, true);
        values.splice(randomIndex, 1);
      }

      return values;
    }

    static vectorToDegrees(vector, baseVector) {
      const referenceVector = baseVector || v2(1, 0);
      const signedAngle = v2(vector.x, vector.y).signAngle(referenceVector);
      return misc.radiansToDegrees(-signedAngle);
    }

    static degreesToVector(degrees, baseVector) {
      const referenceVector = baseVector || v2(1, 0);
      const radians = misc.degreesToRadians(degrees);
      return referenceVector.rotate(radians);
    }

    static getDistance(startPosition, endPosition) {
      return endPosition.subtract(startPosition).length();
    }

    static getDirectionVector(startPosition, endPosition) {
      const direction = endPosition.subtract(startPosition);
      direction.normalize();
      return direction;
    }

    static rotateVectorAroundAxis(vector, degrees, axisVector) {
      const rotationAxis = axisVector || v3(0, 0, 1);
      const radians = misc.degreesToRadians(degrees);
      const normalizedAxis = new Vec3(rotationAxis);
      normalizedAxis.normalize();

      const cosine = Math.cos(radians);
      const sine = Math.sin(radians);
      const axisDotVector = Vec3.dot(normalizedAxis, vector);
      const crossVector = Vec3.cross(new Vec3(), normalizedAxis, vector);

      const rotatedX = vector.x * cosine + crossVector.x * sine + normalizedAxis.x * axisDotVector * (1 - cosine);
      const rotatedY = vector.y * cosine + crossVector.y * sine + normalizedAxis.y * axisDotVector * (1 - cosine);
      const rotatedZ = vector.z * cosine + crossVector.z * sine + normalizedAxis.z * axisDotVector * (1 - cosine);

      return new Vec3(rotatedX, rotatedY, rotatedZ);
    }

    static getRandomSign() {
      return [-1, 1][Util.getRandomNum(0, 1, true)];
    }

    static isPointInsideCircle(point, circleCenter, radius) {
      const offsetX = point.x - circleCenter.x;
      const offsetY = point.y - circleCenter.y;
      return offsetX * offsetX + offsetY * offsetY <= radius * radius;
    }

    static shuffle(values) {
      for (let remainingCount = values.length; remainingCount > 0; remainingCount -= 1) {
        const targetIndex = remainingCount - 1;
        const randomIndex = Math.floor(Math.random() * remainingCount);
        const tempValue = values[targetIndex];
        values[targetIndex] = values[randomIndex];
        values[randomIndex] = tempValue;
      }
      return values;
    }

    static shuffleSubrange(values, startIndex, endIndex) {
      if (startIndex < 0 || endIndex >= values.length) {
        warn("数组越界");
        return;
      }

      for (let targetIndex = endIndex; targetIndex > startIndex; targetIndex -= 1) {
        const randomIndex = Math.floor(Math.random() * (targetIndex - startIndex + 1)) + startIndex;
        const tempValue = values[randomIndex];
        values[randomIndex] = values[targetIndex];
        values[targetIndex] = tempValue;
      }
    }

    static randomReshuffle(values) {
      for (let index = 0; index < values.length; index += 1) {
        const randomIndex = Util.getRandomNum(0, values.length - 1, true);
        if (randomIndex === index) {
          continue;
        }
        const tempValue = values[index];
        values[index] = values[randomIndex];
        values[randomIndex] = tempValue;
      }
    }

    static containsNodeInNestedArray(targetNode, nestedArray) {
      if (!Array.isArray(nestedArray)) {
        return false;
      }

      const walkArray = function walkArray(currentArray, visitedArrays) {
        for (const currentValue of currentArray) {
          if (currentValue === targetNode) {
            return true;
          }

          if (!Array.isArray(currentValue)) {
            continue;
          }

          if (visitedArrays.has(currentValue)) {
            continue;
          }

          const nextVisitedArrays = new Set(visitedArrays);
          nextVisitedArrays.add(currentValue);
          if (walkArray(currentValue, nextVisitedArrays)) {
            return true;
          }
        }

        return false;
      };

      return walkArray(nestedArray, new Set());
    }

    static sortArrayAscending(values) {
      if (!values || values.length <= 1) {
        return;
      }

      values.sort(function sortValue(left, right) {
        if (left < right) {
          return -1;
        }
        if (left > right) {
          return 1;
        }
        return 0;
      });
    }

    static convertNodeSpace(sourceNode, targetNode, localOffset) {
      const offset = localOffset || v3(0, 0);
      const worldPosition = sourceNode.getComponent(UITransform).convertToWorldSpaceAR(offset);
      return targetNode.getComponent(UITransform).convertToNodeSpaceAR(worldPosition);
    }

    static playParticleBurst(count, spriteFrameKey, parentNode, centerPosition) {
      const spawnSingleParticle = function spawnSingleParticle() {
        const particleNode = new NodeCtor("lz");
        particleNode.addComponent(UITransform);
        const opacityComponent = particleNode.addComponent(UIOpacity);
        particleNode.addComponent(Sprite).spriteFrame = ResManager.instance.getSpriteFrame(spriteFrameKey);
        particleNode.parent = parentNode;
        particleNode.layer = 1 << 30;
        particleNode.setPosition(centerPosition.x, centerPosition.y);

        const targetPosition = v3(
          centerPosition.x + Util.getRandomNum(-50, 50, true),
          centerPosition.y + Util.getRandomNum(-75, 75, true),
          0
        );
        particleNode.angle = Util.getRandomNum(0, 360, true);
        particleNode.setScale(0, 0, 0);

        const scaleValue = Util.getRandomNum(0.2, 0.8);
        const delaySeconds = Util.getRandomNum(0, 0.2);
        opacityComponent.opacity = 255;

        tween(particleNode)
          .delay(delaySeconds)
          .to(0.2, {
            scale: v3(scaleValue, scaleValue, scaleValue),
            position: targetPosition
          }, {
            easing: "sineInOut"
          })
          .start();

        tween(opacityComponent)
          .delay(delaySeconds + 0.2)
          .to(0.2, {
            opacity: 0
          }, {
            easing: "sineInOut"
          })
          .call(function destroyParticle() {
            particleNode.destroy();
          })
          .start();
      };

      for (let index = 0; index < count; index += 1) {
        spawnSingleParticle();
      }
    }

    static playRibbonBurst(count, parentNode, centerPosition) {
      AudioManager.instance.playSound("ui/ribbonBurst");

      for (let index = 0; index < count; index += 1) {
        const ribbonNode = new NodeCtor("Ribbon");
        ribbonNode.addComponent(Sprite).spriteFrame = ResManager.instance.getSpriteFrame(
          "ribbon" + Util.getRandomNum(1, 7, true).toString()
        );
        ribbonNode.parent = parentNode;
        ribbonNode.layer = 1 << 25;
        ribbonNode.setPosition(v3(centerPosition.x, centerPosition.y, 0));
        ribbonNode.angle = Util.getRandomNum(0, 360, true);

        const scaleMultiplier = Util.getRandomNum(1, 1.5);
        ribbonNode.getComponent(UITransform).width *= scaleMultiplier;
        ribbonNode.getComponent(UITransform).height *= scaleMultiplier;
        ribbonNode.addComponent(UIOpacity).opacity = 0;

        const spreadDegrees = index * (360 / count);
        const spreadDirection = Util.degreesToVector(spreadDegrees, v2(0, 1));
        ribbonNode.setPosition(
          ribbonNode.position.x + spreadDirection.x * Util.getRandomNum(0, 100, true),
          ribbonNode.position.y + spreadDirection.y * Util.getRandomNum(0, 100, true)
        );

        const travelDistance = Util.getRandomNum(100, 0.5 * GameModel.instance.screenWidth, true);
        const targetPosition = v3(
          centerPosition.x + spreadDirection.x * travelDistance,
          centerPosition.y + spreadDirection.y * travelDistance,
          0
        );

        tween(ribbonNode)
          .by(2, {
            angle: 360 * Util.getRandomSign()
          })
          .repeatForever()
          .start();

        tween(ribbonNode)
          .to(0.5, {
            scale: v3(0.5, 1, 1)
          })
          .to(0.5, {
            scale: v3(1, 1, 1)
          })
          .to(0.5, {
            scale: v3(1, 0.5, 1)
          })
          .to(0.5, {
            scale: v3(1, 1, 1)
          })
          .union()
          .repeatForever()
          .start();

        const appearDelay = Util.getRandomNum(0, 1) / 100;
        tween(ribbonNode)
          .delay(appearDelay)
          .call(function showRibbon() {
            ribbonNode.getComponent(UIOpacity).opacity = 255;
          })
          .to(0.2, {
            position: v3(targetPosition.x, targetPosition.y, 0)
          }, {
            easing: "sineInOut"
          })
          .start();

        tween(ribbonNode)
          .delay(appearDelay + 0.3)
          .by(1, { position: v3(Util.getRandomNum(-100, 100, true), -200, 0) })
          .by(1, { position: v3(Util.getRandomNum(-100, 100, true), -200, 0) })
          .by(1, { position: v3(Util.getRandomNum(-100, 100, true), -200, 0) })
          .by(1, { position: v3(Util.getRandomNum(-100, 100, true), -200, 0) })
          .by(1, { position: v3(Util.getRandomNum(-100, 100, true), -200, 0) })
          .start();

        tween(ribbonNode.getComponent(UIOpacity))
          .delay(appearDelay + 2.3 + Util.getRandomNum(0, 0.5))
          .to(0.2, {
            opacity: 0
          })
          .call(function destroyRibbon() {
            ribbonNode.destroy();
          })
          .start();
      }
    }

    static shakeButton(targetNode) {
      const originalScale = v3(targetNode.scale);
      const shakeDuration = 0.1;

      tween(targetNode)
        .to(shakeDuration, { angle: -5 })
        .to(shakeDuration, { angle: 0 })
        .to(shakeDuration, { angle: 5 })
        .to(shakeDuration, { angle: 0 })
        .to(0.2, {
          scale: v3(originalScale.x + 0.1, originalScale.y + 0.1, originalScale.z + 0.1)
        })
        .to(1.5 * shakeDuration, { scale: originalScale })
        .delay(0.5)
        .union()
        .repeatForever()
        .start();
    }

    static shakeSprite(targetNode) {
      if (Tween.getRunningCount(targetNode) > 0) {
        return;
      }

      const stepDuration = 0.03;
      const originX = targetNode.x;
      const originY = targetNode.y;

      tween(targetNode)
        .by(stepDuration, { position: v3(originX - 2, originY, 0) })
        .by(stepDuration, { position: v3(originX + 2, originY, 0) })
        .by(stepDuration, { position: v3(originX, originY + 2, 0) })
        .by(stepDuration, { position: v3(originX, originY - 2, 0) })
        .union()
        .repeat(2)
        .call(function resetPosition() {
          targetNode.setPosition(originX, originY);
        })
        .start();
    }

    static breatheButton(targetNode) {
      const originScale = v3(targetNode.scale);
      tween(targetNode)
        .to(0.5, {
          scale: v3(originScale.x + 0.1, originScale.y + 0.1, originScale.z + 0.1)
        })
        .to(0.5, {
          scale: originScale
        })
        .union()
        .repeatForever()
        .start();
    }

    static playScratchEffect(basePosition, dragDistance, parentNode, detachedNodeBucket) {
      basePosition.x += 0.5 * dragDistance;
      basePosition.y += 0.5 * dragDistance;

      const scratchCount = 1 + Math.floor(2 * Math.random());
      for (let index = 0; index < scratchCount; index += 1) {
        const scratchPoolKey = Math.random() > 0.5 ? "sk1" : "sk2";
        const scratchNode = PoolManager.Spawn(scratchPoolKey, parentNode);
        if (!scratchNode) {
          continue;
        }

        const spawnOffset = v3(10 * (Math.random() - 0.5), 10 * (Math.random() - 0.5), 0);
        scratchNode.setPosition(v3(basePosition.x + spawnOffset.x, basePosition.y + spawnOffset.y, 0));
        scratchNode.angle = 360 * Math.random();

        let scaleValue = 0.4 + 0.6 * Math.random();
        scratchNode.setScale(v3(scaleValue, scaleValue, scaleValue));

        const opacityComponent = scratchNode.getComponent(UIOpacity);
        opacityComponent.opacity = 255;

        const horizontalVelocity = 200 * (Math.random() - 0.5);
        const verticalVelocity = 100 + 100 * Math.random();
        let gravityValue = 500;
        const lifeSeconds = 1 + 0.5 * Math.random();
        let targetOpacity = 0;
        let recycleToPool = true;

        if (index === 0 && Math.random() > 0.75) {
          targetOpacity = 255;
          gravityValue = 250;
          scaleValue *= 0.55;
          recycleToPool = false;
        }

        const targetPosition = v3(
          basePosition.x + horizontalVelocity * lifeSeconds,
          basePosition.y + verticalVelocity * lifeSeconds - 0.5 * gravityValue * lifeSeconds * lifeSeconds,
          0
        );
        const rotationDelta = 720 * (Math.random() - 0.5);
        const startPosition = scratchNode.getPosition();
        const startAngle = scratchNode.angle;

        tween(opacityComponent)
          .to(lifeSeconds, {
            opacity: targetOpacity
          }, {
            easing: "quadOut"
          })
          .start();

        tween(scratchNode)
          .to(lifeSeconds, {
            position: targetPosition,
            scale: v3(scaleValue, scaleValue, scaleValue),
            angle: scratchNode.angle + rotationDelta
          }, {
            easing: "quadOut",
            onUpdate: function updateScratch(node, ratio) {
              const currentX = startPosition.x + (targetPosition.x - startPosition.x) * ratio;
              const currentY = startPosition.y + verticalVelocity * lifeSeconds * ratio
                - 0.5 * gravityValue * lifeSeconds * lifeSeconds * ratio * ratio;
              node.setPosition(v3(currentX, currentY, 0));
              node.angle = startAngle + rotationDelta * ratio;
            }
          })
          .call(function settleScratch() {
            if (recycleToPool) {
              PoolManager.Despawn(scratchNode);
              return;
            }
            detachedNodeBucket.push(scratchNode);
          })
          .start();
      }
    }

    progressBarEffect(anchorPosition, parentNode) {
      const particleCount = Util.getRandomNum(1, 2, true);

      for (let index = 0; index < particleCount; index += 1) {
        const particleNode = PoolManager.Spawn("lz1", parentNode);
        if (!particleNode) {
          continue;
        }

        particleNode.setPosition(anchorPosition.x, anchorPosition.y, anchorPosition.z);
        particleNode.translate(new Vec3(50 * (Math.random() - 0.5), 5 * (Math.random() - 0.5), 0));

        const scaleValue = Util.getRandomNum(0.8, 1.2);
        particleNode.setScale(v3(scaleValue, scaleValue, scaleValue));

        const opacityComponent = particleNode.getComponent(UIOpacity);
        opacityComponent.opacity = Util.getRandomNum(128, 255);

        const travelDistance = Util.getRandomNum(50, 100);
        const duration = travelDistance / Util.getRandomNum(120, 150);

        tween(opacityComponent)
          .to(duration, {
            opacity: 0
          }, {
            easing: "smooth"
          })
          .start();

        tween(particleNode)
          .by(duration, {
            position: v3(0, -travelDistance, 0)
          }, {
            easing: "quadOut"
          })
          .call(function recycleParticle() {
            PoolManager.Despawn(particleNode);
          })
          .start();
      }
    }

    static flashRed(targetNode) {
      if (!targetNode || !targetNode.getComponent(Sprite)) {
        return;
      }

      const spriteComponent = targetNode.getComponent(Sprite);
      const originalColor = spriteComponent.color.clone();

      tween(spriteComponent)
        .to(0.1, {
          color: new Color(255, 0, 0)
        })
        .to(0.1, {
          color: originalColor
        })
        .delay(0.1)
        .to(0.1, {
          color: new Color(255, 0, 0)
        })
        .to(0.1, {
          color: originalColor
        })
        .union()
        .start();
    }

    static spawnFragmentEffect(sourceNode, parentNode, fragmentGroupKey) {
      const fragmentPathPrefix = "tex/fragment/" + fragmentGroupKey + "/";
      const spawnWorldPosition = sourceNode.worldPosition;
      const spawnWorldRotation = sourceNode.worldRotation;

      for (let index = 0; index < 10; index += 1) {
        const spriteFramePath = fragmentPathPrefix + Util.getRandomNum(1, 6, true).toString() + "/spriteFrame";
        ResManager.instance.bundleLoad("DuckBundle", spriteFramePath, null, function onSpriteLoaded(error, spriteFrame) {
          if (error) {
            console.log(error);
            return;
          }

          const fragmentNode = instantiate(ResManager.instance.getPrefab("fragmentShard"));
          fragmentNode.parent = parentNode;
          fragmentNode.getComponent(Sprite).spriteFrame = spriteFrame;
          fragmentNode.worldPosition = spawnWorldPosition;
          fragmentNode.worldRotation = spawnWorldRotation;

          const scaleValue = Util.getRandomNum(1, 1.7);
          fragmentNode.setScale(v3(scaleValue, scaleValue, 1));

          const launchAngle = Util.getRandomNum(0, 180);
          const launchSpeed = Util.getRandomNum(24, 56);
          const launchVelocity = v2(
            Math.cos(launchAngle * Math.PI / 180),
            Math.sin(launchAngle * Math.PI / 180)
          ).multiplyScalar(launchSpeed);

          let rigidBody = fragmentNode.getComponent(RigidBody2D);
          if (!rigidBody) {
            rigidBody = fragmentNode.addComponent(RigidBody2D);
          }
          rigidBody.type = ERigidBody2DType.Dynamic;
          rigidBody.gravityScale = 10;
          rigidBody.linearVelocity = launchVelocity;
          rigidBody.angularVelocity = Util.getRandomNum(-20, 20);

          tween(fragmentNode.addComponent(UIOpacity))
            .delay(2)
            .call(function cleanupFragment() {
              fragmentNode.destroy();
            })
            .start();
        });
      }
    }

    static addClickEvent(buttonComponent, targetNode, componentName, handlerName, customEventData) {
      const resolvedEventData = customEventData === undefined ? "" : customEventData;
      if (!buttonComponent || !targetNode) {
        warn("按钮或目标节点为空");
        return;
      }

      const clickEvent = new ComponentBase.EventHandler();
      clickEvent.target = targetNode;
      clickEvent.component = componentName;
      clickEvent.handler = handlerName;

      if (resolvedEventData) {
        clickEvent.customEventData = resolvedEventData;
      }

      if (!buttonComponent.clickEvents) {
        buttonComponent.clickEvents = [];
      }

      const alreadyRegistered = buttonComponent.clickEvents.some(function findDuplicate(existingEvent) {
        return existingEvent && existingEvent.handler === handlerName;
      });
      if (!alreadyRegistered) {
        buttonComponent.clickEvents.push(clickEvent);
      }
    }

    static reparentPreservingWorldPosition(targetNode, newParentNode) {
      const worldPosition = targetNode.parent.getComponent(UITransform).convertToWorldSpaceAR(targetNode.position);
      const newLocalPosition = newParentNode.getComponent(UITransform).convertToNodeSpaceAR(worldPosition);
      targetNode.parent = newParentNode;
      targetNode.setPosition(newLocalPosition);
    }

    static getColorFromHex(hexValue) {
      const color = new Color(255, 255, 255);
      Color.fromHEX(color, hexValue);
      return color;
    }

    static parabolaTween(targetNode, duration, startPosition, controlPosition, endPosition, destroyOnFinish, easingName) {
      const shouldDestroy = destroyOnFinish === undefined ? false : destroyOnFinish;
      const easing = easingName === undefined ? "linear" : easingName;

      return tween({ t: 0 })
        .to(duration, {
          t: 1
        }, {
          onUpdate: function updateBezier(state) {
            if (!targetNode.isValid) {
              return;
            }

            const inverseT = 1 - state.t;
            const inverseTSquared = inverseT * inverseT;
            const tSquared = state.t * state.t;
            const currentX = inverseTSquared * startPosition.x
              + 2 * inverseT * state.t * controlPosition.x
              + tSquared * endPosition.x;
            const currentY = inverseTSquared * startPosition.y
              + 2 * inverseT * state.t * controlPosition.y
              + tSquared * endPosition.y;
            const currentZ = inverseTSquared * startPosition.z
              + 2 * inverseT * state.t * controlPosition.z
              + tSquared * endPosition.z;
            targetNode.setPosition(currentX, currentY, currentZ);
          },
          easing: easing
        })
        .call(function cleanupTarget() {
          if (shouldDestroy && targetNode.isValid) {
            targetNode.destroy();
          }
        })
        .start();
    }

    static getAngleForPos(startPosition, endPosition, isVerticalReference) {
      const verticalReference = isVerticalReference === undefined ? false : isVerticalReference;
      let radians = 0;

      if (verticalReference) {
        radians = -Math.atan2(endPosition.x - startPosition.x, endPosition.y - startPosition.y);
      } else {
        radians = Math.atan2(endPosition.y - startPosition.y, endPosition.x - startPosition.x);
      }

      return misc.radiansToDegrees(radians);
    }

    static getPosForAngleLen(degrees, distance, originPosition) {
      const origin = originPosition || v3(0, 0);
      const radians = misc.degreesToRadians(degrees);
      return v3(
        origin.x + Math.cos(radians) * distance,
        origin.y + Math.sin(radians) * distance
      );
    }

    static playFlyingColorMarker(parentNode) {
      const particleNode = instantiate(ResManager.instance.getPrefab("colorMarkerParticle"));
      particleNode.getComponent(Sprite).spriteFrame = ResManager.instance.getSpriteFrame("colorMarker2");
      const opacityComponent = particleNode.getComponent(UIOpacity);
      opacityComponent.opacity = 255;

      particleNode.setPosition(v3(Util.getRandomNum(-40, 40), 0));
      particleNode.setParent(parentNode);
      particleNode.scale = v3(0, 0);
      particleNode.layer = parentNode.layer;

      const flightAngle = Util.getRandomNum(70, 110);
      const flightDistance = Util.getRandomNum(150, 200);
      const targetPosition = Util.getPosForAngleLen(flightAngle, flightDistance);
      const duration = Util.getRandomNum(1, 2);

      tween(particleNode)
        .to(duration, {
          scale: v3(1.2, 1.2),
          position: v3(targetPosition)
        })
        .removeSelf()
        .start();

      tween(opacityComponent)
        .to(duration, {
          opacity: 0
        })
        .start();
    }

    static fakeProgressSmooth(currentValue, targetValue) {
      if (targetValue <= 0 || currentValue <= 0) {
        return 0;
      }
      if (currentValue >= targetValue) {
        return 1;
      }

      const progress = currentValue / targetValue;
      if (progress <= 0.4) {
        return progress * progress * (0.6 / (0.4 * 0.4));
      }

      const normalizedLateProgress = (progress - 0.4) / 0.6;
      return 0.6 + 0.4 * Math.sqrt(normalizedLateProgress);
    }

    static copyString(textValue) {
      const inputNode = document.createElement("input");
      inputNode.value = textValue;
      document.body.appendChild(inputNode);
      inputNode.select();
      document.execCommand("copy");
      document.body.removeChild(inputNode);
    }
  }

  /**
   * 保留与 restored 层一致的旧方法名别名，便于对照阅读。
   * 语义化阅读时优先看左侧真实方法名。
   */
  Util.getDiffNumRandom = Util.pickDistinctNumbersInRange;
  Util.vectorsToDegress = Util.vectorToDegrees;
  Util.getVector = Util.getDirectionVector;
  Util.rotateVector = Util.rotateVectorAroundAxis;
  Util.GetPositiveNegative = Util.getRandomSign;
  Util.pointInCircle = Util.isPointInsideCircle;
  Util.shuffleArrayStartToEnd = Util.shuffleSubrange;
  Util.aginSortArr = Util.randomReshuffle;
  Util.checkNodeInArr = Util.containsNodeInNestedArray;
  Util.sortArray = Util.sortArrayAscending;
  Util.convetOtherNodeSpace = Util.convertNodeSpace;
  Util.playParticle2 = Util.playParticleBurst;
  Util.playRibbonAni = Util.playRibbonBurst;
  Util.btnShake = Util.shakeButton;
  Util.sprShake = Util.shakeSprite;
  Util.btnBreath = Util.breatheButton;
  Util.scratchEffect = Util.playScratchEffect;
  Util.fragmentEffect = Util.spawnFragmentEffect;
  Util.setParent = Util.reparentPreservingWorldPosition;
  Util.FlyLzMove = Util.playFlyingColorMarker;

  return {
    Util
  };
}

module.exports = {
  createUtilModule
};
