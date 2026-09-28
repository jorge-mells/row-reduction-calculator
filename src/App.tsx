import { useReducer } from 'react'
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

      <pre>
        {JSON.stringify(state.matrix, null, 2)}
      </pre>
    </main>
  )
}

export default App
