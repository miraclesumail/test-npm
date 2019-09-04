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




