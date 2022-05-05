// // css的声明文件，有多少个类名就要声明多少个
// declare const styles : {
//   readonly "popup" : string;
//   readonly "popupTitle" : string;
// }
// export default styles
// 每个都要指定，很麻烦
declare const styles : {

  [key: string]: string

}

export default styles;