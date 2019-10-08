console.log('what the kks '
           console.log('rtejrtjrtjrtr');
);

console.log('what wryeyreyrethe kks ');

function reducer1(state = {qq:3}, action) {
    switch (action.type) {
         case 'changeQQ':
            return { 
                ...state, qq: action.qq
            }
         default:
            return state   
    }
}    

function reducer2(state = {ww:3}, action) {
   switch (action.type) {
         case 'changeWW':
            return { 
                ...state, ww: action.ww
            }
         default:
            return state   
   }
}

/** 定义中间件 **/
const logger = ({ getState, dispatch }) => next => action => {
  console.log('【logger】即将执行:', action)
  
  let returnValue = next(action);

  console.log('【logger】执行完成后 state:', getState())
  //return returnValue
}

const logger1 = ({ getState, dispatch }) => next => action => {
  console.log('【logger111】即将执行:', action)

  let returnValue = next(action);

  console.log('【logger222】执行完成后 state:', getState())
  return returnValue
}

const logger2 = ({ getState, dispatch }) => next => action => {
  console.log('【logger333】即将执行:', action)
  console.log(getState(), 'dddddddd');
  let returnValue = next(action);

  console.log('【logger333】执行完成后 state:', getState())
  // return returnValue
}

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

const combineReducers = (reducerObj) => {
    const returnObj = {};
    for(const [key, value] of Object.entries(reducerObj)) {
          returnObj[key] = value(undefined, {type:''});
    } 
    returnObj.receiveAction = (action) => {
          for (let i in reducerObj) {
              let state = returnObj[i];
              state = reducerObj[i](state, action);
              returnObj[i] = state;
          }    
    }
    return returnObj;
}

const applyMiddle = (...middlewares) => {
    return store => {
        let dispatch = store.dispatch;
        let middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        }

        chain = middlewares.map(middleware => middleware(middlewareAPI));
        dispatch = compose(...chain)(store.dispatch);
        return dispatch;
    }   
}

const createStore = (reducers, middleware) => { 
    let listeners = [];
    
    let store = {
        getState(){
            const state = {};
            for(let i in reducers) {
                  if (typeof reducers[i] == 'object') {
                      state[i] = reducers[i]
                  }
            }
            return state;
        },
        dispatch(action){
            const prevState = store.getState();
            reducers.receiveAction(action);
            const nowState = store.getState();
            if (listeners.length) {
                for(let fn of listeners)
                    fn(prevState, nowState);
            }
        },
        subscribe(fn){
            listeners.push(fn);
            return () => {
                listeners = []
            }
        }    
    }
    return {...store, dispatch: middleware(store)}
}

const reducers = combineReducers({reducer1, reducer2});

const store = createStore(reducers, applyMiddle(logger, logger1, logger2));

const unsubscribe = store.subscribe((a, b) => {
    console.log('prev is', a);
    console.log('now is', b);
})

console.log(store.getState());

store.dispatch({type: 'changeQQ', qq: 10});

console.log(store.getState());

unsubscribe();

store.dispatch({type: 'changeWW', ww: 110});

console.log(store.getState());


var request = require('request');
var fs = require('fs');
var fileSystem = require('original-fs');
var path = require('path');
var http = require('http');

function downloadFile(url, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(url).pipe(stream).on('close', callback);
    stream.on('close', () => console.log('end', e));
}

// downloadFile('http://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', 'test.png', function(){
//     console.log('下载完毕');
// });

options = {
    host: 'www.google.com'
  , port: 80
  , path: '/images/logos/ps_logo2.png'
}

var request = http.get('http://localhost:3003/storage/img/studio.exe', res => {
     let imgData = '';
     const now = new Date().getTime();
     const len = parseInt(res.headers['content-length'], 10);
     let total = 0;
     res.setEncoding('binary');
     console.log('the file u download is', len)
     res.on('data', chunk => {
         console.log(chunk.length);
         total += chunk.length;
         imgData += chunk;
     })

     res.on('end', () => {
         console.log('total time', new Date().getTime() - now);
         console.log(len, '---', total);
         fileSystem.writeFile('studio.exe', imgData, 'binary', () => {
             console.log('存完了');
         })
     })
})

// var request = http.get(options, function(res){
//     var imagedata = ''
//     res.setEncoding('binary')

//     res.on('data', function(chunk){
//         imagedata += chunk
//     })

//     res.on('end', function(){
//         fs.writeFile('logo.png', imagedata, 'binary', function(err){
//             if (err) throw err
//             console.log('File saved.')
//         })
//     })
// })

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
          *{
              margin: 0; padding: 0
          }

          .move{
              position: absolute;
              width: 30px;
              height: 30px;
              background: yellowgreen;
              border-radius: 50%;
              top: 10px;
              left: 100px;
          }

          /* canvas{
              position: absolute;
              width: ;
              height: 100%;
          } */
    </style>
</head>
<body>
    <!-- <div class='move'></div> -->
    <script>
       var polyBez = function(p1, p2) {
        var A = [null, null], B = [null, null], C = [null, null],
            bezCoOrd = function(t, ax) {
              C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
              return t * (C[ax] + t * (B[ax] + t * A[ax]));
            },
            xDeriv = function(t) {
              return C[0] + t * (2 * B[0] + 3 * A[0] * t);
            },
            xForT = function(t) {
              var x = t, i = 0, z;
              while (++i < 14) {
                z = bezCoOrd(x, 0) - t;
                if (Math.abs(z) < 1e-3) break;
                x -= z / xDeriv(x);
              }
              return x;
            };
        return function(t) {
          return bezCoOrd(xForT(t), 1);
        }
      }
    </script>
    <script>
         // console.log(document.querySelector('.move').offsetTop);

         function moveElement(ele, dis, duration, move = 'easeOutQuad') {
               let progress = 0;
               let top = ele.offsetTop;
               const fn = movingMethod.cubizer(.26,.62,.51,-0.24);
               function translate() {
                    if (progress >= duration) {
                    } else {
                        // const nowTop = top + dis*movingMethod[move](progress/duration);
                        const nowTop = top + dis*fn(progress/duration);
                        ele.style.top = nowTop + 'px';
                        progress += 1000/60;
                        requestAnimationFrame(translate)
                    }
               }
               translate();
         }

         const movingMethod = {
            easeOutQuad: function (x) {
		        return 1 - ( 1 - x ) * ( 1 - x );
            },
            easeInQuad: function (x) {
                return x * x;
            },
            cubizer(...coOrdArray) {
                return x => {
                    return polyBez([coOrdArray[0], coOrdArray[1]], [coOrdArray[2], coOrdArray[3]])(x)
                }
            }
         } 

         const ball = document.querySelector('.move');

         var c = document.createElement('canvas');
         var canvasWidth = document.body.clientWidth;
         var canvasHeight = document.body.clientHeight;
         c.width = canvasWidth;
         c.height = canvasHeight;

         document.body.appendChild(c);
         var ctx = c.getContext("2d");

         class snowController {
             constructor(options) {
                this.ctx = options.ctx;
             }
         }

         /** 
          *  begin: 初始位置
          *  end：结束位置
          *  duration: 总时间 
          *  moveWay: 动画方式
          *  radius: 球的半径
         */
         class snowBall{
              constructor(options) {
                 this.duration = options.duration;
                 this.begin = options.begin;
                 this.end = options.end;
                 this.radius = options.radius;
                 this.direction = options.direction || 1;
                 this.progress = 0;
                 this.maxTime = options.maxTime;
                 this.cuziber = [[.15,.67,.62,.86], [.66,.2,.92,.61]];
                 // this.duration = [1000, 300];
                 this.round = 0;
              }

              // 初始化
              init() {
                 this.beginAnimation();
              }

              // 重置数据
              resetData() {
                 this.progress = 0;
                 this.duration = this.direction ? this.duration + 300 : this.duration - 300;

                 this.direction = this.direction ? 0 : 1;
                 if (!this.direction) this.radius -= 5;
                 let top = this.direction ? 0 : this.begin.top + 1/2*(canvasHeight - this.radius - this.begin.top);
                 this.begin = this.end;

                 this.end = {left: this.begin.left + 50, top: this.direction ? canvasHeight - this.radius : top};
                 console.log(this.end);
              }

              // 动画开始
              beginAnimation() {
                 if (this.progress > this.duration) {
                     console.log('the whole process finished');
                     if (this.round === this.maxTime) return;
                     this.round += 1;
                     this.resetData();
                     this.beginAnimation();
                 } else {
                     const { left, top } = this.getPosition();
                     ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                     this.drawBall(left, top);
                     this.progress += 1000/60;
                     requestAnimationFrame(this.beginAnimation.bind(this));  
                 }
              }

              // 绘制snow ball
              drawBall(left, top) {
                 const { radius } = this; 
                 ctx.beginPath();
                 ctx.arc(left + radius/2, top + radius/2, radius/2, 0, 2*Math.PI);
                 ctx.fillStyle="yellowgreen";
                 ctx.closePath(); 
                 ctx.fill();
              }

              // 获取绘制canvas ball的位置参数
              getPosition() {
                 const { left: left1, top: top1 } = this.begin; 
                 const { left: left2, top: top2 } = this.end;
                 let { progress, duration, cuziber, direction, round } = this;

                 // duration = duration[direction] - direction ? round*30 : round*100;
                 const left = left1 + (left2 - left1)*(progress/duration);
                 // const top = top1 + (top2 - top1)*movingMethod.easeOutQuad(progress/duration);
                 const top = top1 + (top2 - top1)*movingMethod.cubizer(...cuziber[direction])(progress/duration);
                 return {left, top};
              }
         }

         const sb = new snowBall({
             begin: { left: 300, top: 0 },
             end: { left: 350, top: canvasHeight - 30 },
             radius: 30,
             duration: 300,
             maxTime: 10
         })
        
         sb.init();
    </script>
</body>
</html>

#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const { sum } = require('./test');

program.version('1.1.1');

/**
 * 
 * @param {*} a cli 传入的参数
 * @param {*} b 默认值 空则为undefined
 */
const changeDebug = (a, b) => {
    console.log(a, b);
    return a*5;
}
 
// program
//   .option('-d, --debug <qwe>', 'output extra debugging', changeDebug, 3)
//   .option('-s, --small', 'small pizza size')
//   .option('-p, --pizza-type <type>', 'flavour of pizza', 'default small');
 
// console.log(program.opts()); 
// if (program.debug) console.log(program.opts());
// console.log('pizza details:');
// if (program.small) console.log('- small pizza size', program.opts());
// if (program.pizzaType) console.log(`- ${program.pizzaType}`);

program
  .command('clone <source> [destination]')
  .description('clone a repository into a newly created directory')
  .alias('cl')
  .option('-d --debug <qwe>', 'output extra debugging', 5)
  .option('-s --small <small>', 'output extra debugging', 15)
  .action((source, destination, {debug, small}) => {
    console.log(source, destination, debug, small);  
    // fs.mkdirSync(path.resolve(process.cwd(), source));

    // console.log(fs.readFileSync(path.resolve(process.cwd(), './config/test.json'), {encoding: 'utf-8'}));
    console.log(sum(source, destination));
    console.log('clone command called');
  });

program
.command('play <source> [destination]')
.description('clone a repository into a newly created directory')
.alias('pl')
.action((source, destination, {debug, small}) => {
  console.log(source, destination, debug, small);  
  console.log(sum(source, destination));
  console.log('clone command called');
});  

program
.command('playd <source> [destination]')
.description('clone a repository into a newly created directory')
.alias('pld')
.action((source, destination, {debug, small}) => {
  console.log(source, destination, debug, small);  
  console.log(sum(source, destination));
  console.log('clone command called');
}); 

program.on('--help', () => {
  console.log('')
  console.log('Examples:');
  console.log('  $ custom-help --help');
  console.log('  $ custom-help -h');
})  

if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
}
 
function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}

program.parse(process.argv);

var jwt = require('jsonwebtoken');
// sign with RSA SHA256  同步
var privateKey = fs.readFileSync('private.key');
var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256'});

// 改变iat(issue at)  异步
jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, privateKey, { algorithm: 'RS256' }, function(err, token) {
  console.log(token);
});

// 设置token一小时过期
jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'foobar'
}, 'secret');
或者
jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: 60 * 60 });

// 验证一个token
jwt.verify(token, 'shhhhh', function(err, decoded) {
  console.log(decoded.foo) // bar
});


https://itnext.io/making-cli-app-with-ease-using-commander-js-and-inquirer-js-f3bbd52977ac

https://github.com/SmallStoneSK/react-router-animation-demo
