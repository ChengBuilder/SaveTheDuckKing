const mini_game_test = require('mini_game_test');
const BaseCase = mini_game_test.BaseCase;
const logger = mini_game_test.logger;

class Test extends BaseCase {
  async run(c) {
    logger.info('start');

    const path = process.env.WECHAT_MINIGAME_TEST_NODE_PATH || '__FILL_WITH_GAME_INSPECTOR_PATH__';
    if (path === '__FILL_WITH_GAME_INSPECTOR_PATH__') {
      throw new Error('请设置 WECHAT_MINIGAME_TEST_NODE_PATH 为 Game Inspector 复制出的节点 Path。');
    }

    let target = null;
    target = await c.findPath(path);
    await target.tap();
    await c.sleep(3000);
  }
}

const test = new Test();
test.start();
