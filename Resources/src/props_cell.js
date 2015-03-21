var PropsTableViewCell = cc.TableViewCell.extend({
  _sprite:null,
  _isSelected:false,
  _selectedBorder:null,
  _goldIcon:null,
  _goldLabel:null,
  init:function(prop) {
    var sprite = cc.Sprite.create('res/' + prop.textureName);
    sprite.setAnchorPoint(cc.p(0,0));
    sprite.setPosition(18, 0);
    sprite.setTag(100);
    this.addChild(sprite);

    var goldIcon = cc.Sprite.create('res/menu_props_gold_icon.png');
    goldIcon.setPosition(64, 40);
    this.addChild(goldIcon);

    var goldLabel = cc.LabelTTF.createWithFontDefinition('', g_propGoldFontDef);
    goldLabel.setString(prop.price == 0 ? "FREE" : prop.price);
    this.addChild(goldLabel);
    goldLabel.setAnchorPoint(cc.p(0, 0.5));
    goldLabel.setPosition(80, 36);
    
    var selectedBorder = cc.Sprite.create('res/menu_props_selected_border.png');
    this.addChild(selectedBorder);
    selectedBorder.setPosition(18, 0);
    selectedBorder.setAnchorPoint(cc.p(0, 0));
    selectedBorder.setVisible(false);

    this._sprite = sprite;
    this._selectedBorder = selectedBorder;
    this._goldIcon = goldIcon;
    this._goldLabel = goldLabel;
  },
  setProp:function(prop) {
    this._sprite.setTexture(cc.TextureCache.getInstance().addImage('res/' + prop.textureName));
    this._goldLabel.setString(prop.price == 0 ? "FREE" : prop.price);
  },
  setSelected:function(selected) {
    this._isSelected = selected;
    if (selected) {
      this._selectedBorder.setVisible(true);
      this._goldIcon.setVisible(false);
      this._goldLabel.setVisible(false);
    } else {
      this._selectedBorder.setVisible(false);
      this._goldIcon.setVisible(true);
      this._goldLabel.setVisible(true);
    }
  },
  toggleSelected:function() {
    this.setSelected(!this._isSelected);
  },
  draw:function(ctx) {
    this._super(ctx);
  }
});


