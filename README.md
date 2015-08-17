# miniNav

## 简介

这是一个基于键盘可自定义的导航页。

## 用到的库及插件

1. jQuery
1. [sweetalert](https://t4t5.github.io/sweetalert/)
2. progress.js(未实现)

## 代码规范

参考了[去哪儿](https://github.com/byr-gdp/html-css-guide)、[17173](https://github.com/byr-gdp/javascript-style-reference)等前端规范，相比之下有些出入，结合代码选择适合自己的。说明以下几点：

1. 代码在参考了相关规范后**有意为之**并做了改动，仍在参考、学习、磨合中。
1. 采用tab（四个空格）缩进。虽然两个空格来代替制表符（tab）是唯一能保证在所有环境下获得一致展现的方法（去哪儿明确表示tab）。曾经尝试2个空格，但缩进太短看着难受。
2. for循环中空格的使用目前参考资料有限尚未定论，目前比较符号（如=、<=等）左右均无空格


## 功能

### 已实现

1. 按下键位，显示当前站点，回车后跳转(如可用)
2. ctrl+字母键位，编辑或添加站点
3. alt+字母键位，删除当前站点
4. 利用新浪提供脚本获取访问者ip信息
5. 利用聚合数据根据ip所在城市给出实时天气信息和温馨提示

### 进行中

1. 引入 progress.js

### 未进行

4. 备忘录，利用css3、localstorage
5. 北邮人论坛十大（必要性有待论证）
6. 时钟，同步当前时间（出现的合理性、违和感）


## 设计

### 已完成

1. 键盘模拟mac键位

### 准备


1. 背景模拟书桌，毫无违和感的前提是键盘得逼真


