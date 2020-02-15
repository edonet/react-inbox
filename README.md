# react-inbox
React state management.

## Install
``` shell
$ yarn add react-inbox
```

## Usage

### Create state and action in `./store.js`:
``` javascript
import store from 'react-inbox';

// create state
export const state = store({
    sum: 0
});

// action
export function add(num) {
    state.sum += num;
}
```

### Use state and action in `./App.jsx`:
``` javascript
import React from 'react';
import { useStore } from 'react-inbox';
import { state, add } from './store';

export default function App() {
    return useStore(() => (
        <div>
            <span>{ state.sum }</span>
            <button onClick={ () => add(1) }>Add</button>
        </div>
    ));
}
```
