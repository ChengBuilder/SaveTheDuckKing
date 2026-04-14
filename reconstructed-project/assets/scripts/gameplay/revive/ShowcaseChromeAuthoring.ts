import {
  _decorator,
  Color,
  Component,
  Graphics,
  HorizontalTextAlignment,
  Label,
  LabelOutline,
  Node,
  UITransform,
  VerticalTextAlignment
} from 'cc';

const { ccclass, property, executeInEditMode, disallowMultiple } = _decorator;

const CHROME_ROOT_NAME = '__showcaseChrome';
const BACKDROP_NODE_NAME = '__showcaseBackdrop';
const TITLE_NODE_NAME = '__showcaseTitle';
const SUBTITLE_NODE_NAME = '__showcaseSubtitle';
const HINT_NODE_NAME = '__showcaseHint';

@ccclass('ShowcaseChromeAuthoring')
@executeInEditMode
@disallowMultiple
export class ShowcaseChromeAuthoring extends Component {
  @property({ tooltip: 'Headline shown inside the showcase header.' })
  title = '';

  @property({ tooltip: 'Secondary copy rendered under the title.' })
  subtitle = '';

  @property({ tooltip: 'Small helper text shown at the bottom of the panel.' })
  hint = '';

  @property({ tooltip: 'Header panel width.' })
  panelWidth = 640;

  @property({ tooltip: 'Header panel height.' })
  panelHeight = 164;

  @property({ tooltip: 'Panel center Y, in local coordinates of the host node.' })
  panelCenterY = 500;

  @property({ tooltip: 'Title font size.' })
  titleFontSize = 40;

  @property({ tooltip: 'Subtitle font size.' })
  subtitleFontSize = 24;

  @property({ tooltip: 'Hint font size.' })
  hintFontSize = 20;

  private _lastAppliedKey = '';

  onEnable(): void {
    this.applyChrome();
  }

  update(): void {
    const key = [
      this.title,
      this.subtitle,
      this.hint,
      this.panelWidth,
      this.panelHeight,
      this.panelCenterY,
      this.titleFontSize,
      this.subtitleFontSize,
      this.hintFontSize
    ].join('|');

    if (key !== this._lastAppliedKey) {
      this.applyChrome();
    }
  }

  private applyChrome(): void {
    const chromeRoot = this.ensureNode(this.node, CHROME_ROOT_NAME);
    chromeRoot.layer = this.node.layer;
    chromeRoot.setSiblingIndex(Math.max(0, this.node.children.length - 1));

    const hostTransform = this.node.getComponent(UITransform);
    const chromeTransform = chromeRoot.getComponent(UITransform) || chromeRoot.addComponent(UITransform);
    if (hostTransform) {
      chromeTransform.setContentSize(hostTransform.contentSize.width, hostTransform.contentSize.height);
    }

    const backdropNode = this.ensureNode(chromeRoot, BACKDROP_NODE_NAME);
    backdropNode.layer = this.node.layer;
    backdropNode.setPosition(0, this.panelCenterY, 0);
    const backdropTransform = backdropNode.getComponent(UITransform) || backdropNode.addComponent(UITransform);
    backdropTransform.setContentSize(this.panelWidth, this.panelHeight);
    this.drawBackdrop(backdropNode, this.panelWidth, this.panelHeight);

    this.applyLabelNode(backdropNode, TITLE_NODE_NAME, this.title, this.titleFontSize, new Color(248, 236, 201, 255), 40);
    this.applyLabelNode(
      backdropNode,
      SUBTITLE_NODE_NAME,
      this.subtitle,
      this.subtitleFontSize,
      new Color(220, 223, 232, 255),
      0
    );
    this.applyLabelNode(backdropNode, HINT_NODE_NAME, this.hint, this.hintFontSize, new Color(157, 181, 206, 255), -46);

    this._lastAppliedKey = [
      this.title,
      this.subtitle,
      this.hint,
      this.panelWidth,
      this.panelHeight,
      this.panelCenterY,
      this.titleFontSize,
      this.subtitleFontSize,
      this.hintFontSize
    ].join('|');
  }

  private applyLabelNode(
    parent: Node,
    nodeName: string,
    text: string,
    fontSize: number,
    color: Color,
    localY: number
  ): void {
    const labelNode = this.ensureNode(parent, nodeName);
    labelNode.layer = parent.layer;
    labelNode.active = text.trim().length > 0;
    labelNode.setPosition(0, localY, 0);

    const transform = labelNode.getComponent(UITransform) || labelNode.addComponent(UITransform);
    transform.setContentSize(this.panelWidth - 72, Math.max(28, fontSize + 12));

    const label = labelNode.getComponent(Label) || labelNode.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 8;
    label.useSystemFont = true;
    label.color = color;
    label.horizontalAlign = HorizontalTextAlignment.CENTER;
    label.verticalAlign = VerticalTextAlignment.CENTER;
    label.overflow = Label.Overflow.SHRINK;

    const outline = labelNode.getComponent(LabelOutline) || labelNode.addComponent(LabelOutline);
    outline.color = new Color(17, 20, 30, 220);
    outline.width = fontSize >= this.titleFontSize ? 3 : 2;
  }

  private drawBackdrop(node: Node, width: number, height: number): void {
    const graphics = node.getComponent(Graphics) || node.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = new Color(13, 18, 28, 186);
    graphics.roundRect(-width / 2, -height / 2, width, height, 28);
    graphics.fill();
    graphics.lineWidth = 3;
    graphics.strokeColor = new Color(235, 188, 108, 150);
    graphics.stroke();
  }

  private ensureNode(parent: Node, nodeName: string): Node {
    let childNode = parent.getChildByName(nodeName);
    if (childNode && childNode.isValid) {
      return childNode;
    }

    childNode = new Node(nodeName);
    childNode.layer = parent.layer;
    parent.addChild(childNode);
    return childNode;
  }
}
