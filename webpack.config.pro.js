const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin= require('mini-css-extract-plugin')
module.exports = {
  entry:'./src/main.ts',
  output:{
    // 输出路径要求是绝对路径
    path: path.resolve(__dirname, 'dist'),
    filename:'main.js'
  },
  devServer: {
    // 根目录
    // contentBase: '/dist',该属性已被弃用
    // 自动动打开服务，浏览器页面是热更新状态
    open: true
  },
  resolve: {
    // 省略扩展名
    "extensions":['.ts','.js','.json']
  },
  module:{
    // 样式处理器，将css文件处理成模块化导入形式
    rules:[
      {
        test:/\.css/,
        // 现原形后面的css-loader
        use:[MiniCssExtractPlugin.loader,'css-loader'],
        exclude:[
          // 此路径下的样式不参与全局模块化
          path.resolve(__dirname,'src/components')
        ]
      },
      {
        test:/\.css/,
        // 现原形后面的css-loader
        use:[MiniCssExtractPlugin.loader,{
          // 现在所匹配的css文件要当成模块化的文件去使用
          loader:'css-loader',
          options:{
            modules:{
              localIdentName:'[path][name]__[local]--[hash:base64:5]'
            }
          }
        }],
        include:[
          // 这个文件下的css文件要当成模块化的css文件去使用
          path.resolve(__dirname,'src/components')
        ]
      },
      // {
      //   test:/\.(woff2|woff|ttf)$/,
      //   use:[{
      //     loader: 'file-loader',
      //     options:{
      //       outputPath:'iconfont'
      //     }
      //   }]
      // },
      {
        test:/\.(woff2|woff|ttf)$/,
        type:'asset/resource',
        generator: {
          filename:'font/[hash:10].[ext]'
        }
      },
      {
        test:/\.ts$/,
        use:['ts-loader'],
        // 排除包文件
        exclude:/node_modules/ 
      }
    ]
  },
  plugins: [
    // 自动生成dist文件的index.html,首先在src路径下生成一个模板的html文件
    new HtmlWebpackPlugin({
      // 配置模板
      template: "./src/index.html"
    }),
    // 每次打包之前清空打包目录下的文件,否则打包一次就会产生新的文件
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  mode:'production'
}