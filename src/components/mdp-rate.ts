import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * 评分组件---why
 *
 * 评分组件共有五种形式 分别为  基础形式，变色形式，图标改变形式，文字辅助形式，只读形式
 * 
 * 基础形式需传入：maxRateNum rateIcon rateInitColor rateSelColor
 * rateIcon：{'off':'没选中图标','on':['选中的图标数组']}
 * 
 * 变色形式需传入：maxRateNum rateIcon rateInitColor rateSelColor rateNumChange
 * rateSelColor：为一个色码数组 传一个颜色默认不变色：['红色','蓝色','白色']
 * rateNumChange：为一个指定特定个数为一组的数组，每一组显示的颜色与rateSelColor一一对应（重要！！！！！） 不传值
 * 则根据rateSelColor长度均分变色。 如前面两个为一个变色 中间一个变色 最后两个变色则传：[2,1,2]
 * 
 * 图标改变形式：maxRateNum rateIcon rateInitColor rateSelColor rateNumChange
 * rateIcon: 传入一个图标数组
 * 
 * 文字辅助形式：maxRateNum rateIcon rateInitColor rateSelColor rateText
 * rateText：辅助文字为一个长度等于最大显示图标数的数组，内容为每个图标等级显示的辅助文字  重要！！！
 * 
 * 只读形式：maxRateNum rateIcon rateSelColor disabled rateValue showRateValue
 * 只读形式的分数显示与文字辅助显示的文字不一样，文字辅助显示的文字与图标个数一一对应，分数只显示一个，
 * 由showRateValue控制 
 * 
 */
@Component({
  selector: 'mdp-rate',
  template: `
  <div class="rate-label">
  <ion-icon tappable *ngFor="let rate of rates" (click)="rageNum(rate)" [name]="rate.showIcon" [ngStyle]="{'color':rate.selColor}"></ion-icon>
  <span *ngIf="showText" [ngStyle]="{'color':rateTextColor}">{{rateFzText}}</span>
</div>`
})
export class MdpRateComponent {
  @Output() onRate = new EventEmitter();
  @Input() maxRateNum: number = 5;//显示的图标个数
  @Input() rateIcon: any = { 'off': 'ion-ios-star-outline', 'on': ['ion-ios-star'] };//显示的图标 默认为星星
  @Input() rateInitColor: string = '#bfcbd9';//初始颜色
  @Input() rateSelColor: any = ['#F7BA2A'];//选中颜色
  @Input() rateNumChange: number[] = [];//多少个变一次颜色
  @Input() rateText: string[] = [];//辅助显示文字
  @Input() rateTextColor: string;//辅助文字颜色
  @Input() disabled: any = "false";//评分是否只读
  @Input() rateValue: any = "0.0";//分数
  @Input() showRateValue: any = "false";//是否显示分数
  showColList: any[];
  showIconList: any[];
  rates: any[] = [];
  rateFzText: string;
  showText: boolean = false;
  readOnly: boolean = false;

  constructor() {

  }

  ngOnInit() {
    this.showText = this.rateText.length == 0 ? false : true;

    if (this.disabled == "false") {
      this.readOnly = false;
      this.initRate(true)
    } else {
      if (this.showRateValue != "false") {
        this.showText = true;
        this.rateFzText = this.rateValue;
      }
      this.readOnly = true;
      this.initRate(false);
    }

    this.showColList = this.toRageGroup(this.rateSelColor, this.maxRateNum, this.rateNumChange);

    this.showIconList = this.toRageGroup(this.rateIcon.on, this.maxRateNum, this.rateNumChange);

    let z = this.rateValue.split(".");
    z[0] > 0 && setTimeout(() => {
      let a = z[0] > this.maxRateNum ? this.maxRateNum - 1 : z[0] - 1;
      this.rageNum(this.rates[a]);
    }, 1)

  }

  /**
   * 组件初始化，并初始化组件是否只读
   * @param isDisabled 组件是否只读，true为只读，false为可编辑，只读支持小数，可编辑不支持小数会自动忽略
   */
  initRate(isDisabled) {
    let z = this.rateValue.split(".");
    if (isDisabled) {
      for (let i = 0; i < this.maxRateNum; i++) {
        this.rates.push({ 'id': i, 'showIcon': this.rateIcon.off, 'selColor': this.rateInitColor });
      }
    } else {
      for (let i = 0; i < this.maxRateNum; i++) {
        if (i < z[0] * 1) {
          this.rates.push({ 'id': i, 'showIcon': this.rateIcon.on[0], 'selColor': this.rateSelColor[0] });
        } else if (i == z[0] && z[1] != 0 && z[1] != undefined) {
          if (this.rateIcon.on[1] == undefined || this.rateIcon.on[1] == "") {
            this.rates.push({ 'id': i, 'showIcon': 'ion-ios-star-half', 'selColor': this.rateSelColor[0] });
          } else {
            this.rates.push({ 'id': i, 'showIcon': this.rateIcon.on[1], 'selColor': this.rateSelColor[0] });
          }
        } else {
          this.rates.push({ 'id': i, 'showIcon': this.rateIcon.off, 'selColor': this.rateInitColor });
        }
      }

    }

  }

  /**
   * 
   * @param objArr 需分组对象数组 颜色数组或图标数组
   * @param allNum 总数
   * @param chgArr 多少个变一次颜色
   */
  toRageGroup(objArr, allNum: number, chgArr) {
    var objList = new Array(allNum);
    let cl: number = objArr.length;

    if (chgArr.length != 0) {
      initResult();
    } else {
      if (cl == 1) {
        chgArr = [allNum];
        initResult();
      }
      else {
        let zs = parseInt(allNum / cl + "");
        let ys = allNum % cl;
        chgArr = new Array(cl);
        for (let i = 0; i < cl; i++) {
          chgArr[i] = zs;
          ys != 0 ? chgArr[i] = ys : false;
        }
        initResult();
      }
    }

    function initResult() {
      let a = 0;
      for (let i = 0; i < chgArr.length; i++) {
        for (let j = 0; j < chgArr[i]; j++) {
          objList[a] = objArr[i];
          a++;
        }
      }
    }
    return objList;

  }

  rageNum(obj) {
    if (!this.readOnly) {
      if (this.showText) {
        this.rateFzText = this.rateText[obj.id];
      }

      for (let i = 0; i < this.maxRateNum; i++) {
        if (i <= obj.id) {
          this.rates[i].showIcon = this.showIconList[obj.id];
          this.rates[i].selColor = this.showColList[obj.id];
        } else {
          this.rates[i].showIcon = this.rateIcon.off;
          this.rates[i].selColor = this.rateInitColor;
        }
      }
      this.onRate.emit(obj.id + 1);
    }


  }

}
