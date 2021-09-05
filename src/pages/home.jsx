import React, { useEffect, useState } from 'react';
import  axios  from '../api/axios-config.js';
import { useSelector, useDispatch } from 'react-redux'

import { Card } from '../components/card'
import pokemon from '../images/pokemon-com.png';
import { Pagination } from '../components/pagination'
import { addFav, removeFav } from '../store/fav.js';
import { loading } from '../utils/functions.js';
import firebaseConfig from '../utils/firebase.js';

export function Home () {
  const [ pokemons, setPokemon ] = useState([])
  const [ current, setCurrent ] = useState(1)

  let favorites = useSelector((state) => state.fav.favorites) || []
  const dispatch = useDispatch()

  const total = 100
  const perPage = 20

  useEffect(() => {
    console.log(firebaseConfig)
    const start = perPage * (current - 1) + 1
    const stop = perPage * (current - 1) + perPage
    getPokemons(start, stop)
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  function getPokemons (start, stop) {
    const length = stop - start + 1
  
    loading().start()
    return Promise.all(
      Array.from({length}, (_v, i) => 
        getPokemonColor(`https://pokeapi.co/api/v2/pokemon/${start + i}`)
      )
    ).then((res) => {
      setPokemon(res)
      loading().finish()
      window.scrollTo({ top: 0, behavior: 'smooth'})
    })
  }

  async function getPokemonColor (url) {
    const result = await axios.get(url)
    return result.data
  }

  async function addFavorite (e, id) {
    e.stopPropagation()
    if (!localStorage.getItem('token')) {
      openModal()
      return
    }
    if (favorites.includes(id)) {
      onDeleteFav(id)
    } else {
      onAddFav(id)
    }
  }

  async function onDeleteFav (id) {
    dispatch(removeFav({favorites, id}))
  }

  async function onAddFav (id) {
    dispatch(addFav({favorites, id}))
  }

  function openModal () {
    const openModal = new Event('openModal')
    window.dispatchEvent(openModal)
  }

  async function changePage (newPage) {
    setCurrent(newPage)
  }

  function openSideBar (id) {
    const openSideBar = new CustomEvent('openSidebar', {'detail': id})
    window.dispatchEvent(openSideBar)
  }

  return (
    <main className="main container">
      <div className="banner">
        <img src={pokemon} alt="pokemon company"/>
      </div>
      <div className="row">
      {
        pokemons.map((item, index) => {
          return (
            <div key={index} className="col-3 pb-4">
              <Card
                key={index}
                data={{
                  isFavorite: favorites.includes(item.id), 
                  id: item.id,
                  name: item.name,
                  image: `https://img.pokemondb.net/artwork/large/${item.name}.jpg`,
                  type: item.types[0].type.name,
                  typeFull: item.types,
                  stats: item.stats
                }}
                addFavorite={addFavorite}
                openSideBar={openSideBar}
              />
            </div>
          )
        })
      }
      </div>
      {
        pokemons.length ? 
        <Pagination
          changePage={changePage}
          data={{
            total,
            perPage,
            current
          }}
          className="my-3"
        /> :
        ''
      }
    </main>
  )
}
