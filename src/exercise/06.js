// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useEffect, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [{pokemon, status, error}, setState] = useState({
    pokemon: null,
    status: 'idle',
    error: null,
  })

  useEffect(() => {
    if (Boolean(pokemonName)) {
      setState(prev => {
        return {...prev, status: 'pending'}
      })
      fetchPokemon(pokemonName)
        .then(pokemon => {
          setState(prev => {
            return {...prev, pokemon, status: 'resolved'}
          })
        })
        .catch(error => {
          setState(prev => {
            return {...prev, error, status: 'rejected'}
          })
        })
    }
  }, [pokemonName])

  if (status === 'idle') return 'Submit a pokemon'
  else if (status === 'pending')
    return <PokemonInfoFallback name={pokemonName} />
  else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
