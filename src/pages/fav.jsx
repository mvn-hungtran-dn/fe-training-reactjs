import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import axios  from '../api/axios-config.js';
import { removeFav } from '../store/fav.js'

export function Fav () {
  let favorites = useSelector((state) => state.fav.favorites)
  const [ pokemons, setPokemon ] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    getPokemons()
  }, [])

  function getPokemons () {
    const startLoading = new Event('loadingStart')
    const finishLoading = new Event('loadingFinish')
    window.dispatchEvent(startLoading)
    return Promise.all(
      favorites.map((id) => 
        handApi(`https://pokeapi.co/api/v2/pokemon/${id}`)
      )
    ) .then((res) => {
      setPokemon(res)
      window.dispatchEvent(finishLoading)
    })
  }

  async function handApi (url) {
    const result = await axios.get(url)
    return result.data
  }

  function onRemoveFav (id) {
    dispatch(removeFav(id))
    const poke = pokemons.filter((item) => item.id !== id)
    setPokemon(poke)
  }

  return (
    <div className="page-fav container">
      <ul className="list-fav row">
        {
          pokemons.map((item, index) => (
            <li className="col-6" key={index}>
              <div className="item-fav">
                <img
                  src={ `https://img.pokemondb.net/artwork/large/${item.name}.jpg`}
                  alt="pokemon"
                />
                <p className="name">{item.name}</p>
                <AiOutlineCloseCircle onClick={() => onRemoveFav(item.id)} className="icon" />
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
