import { useReducer } from 'react'
import MatrixEditor from './components/MatrixEditor'
import { initialState } from './state/initialState'
import { appReducer } from './state/reducer'

function App() {
  const [state, dispatch] = useReducer(
    appReducer,
    initialState,
  )

  return (
    <main>
      <h1>Row Reduction Calculator</h1>

      <MatrixEditor
        matrix={state.matrix}
        dispatch={dispatch}
      />
    </main>
  )
}

export default App
