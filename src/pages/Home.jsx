import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../App.module.css'

export default function App() {
  const [coll1Names, setColl1Names] = useState([])
  const [coll2Names, setColl2Names] = useState([])
  const [coll3Names, setColl3Names] = useState([])
  const [selectedColl1Name, setSelectedColl1Name] = useState('')
  const [selectedColl2Name, setSelectedColl2Name] = useState('')
  const [selectedColl3Name, setSelectedColl3Name] = useState('')
  const [coll1NameError, setColl1NameError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function getCollectionsNames() {
      await getColl1Names()
      if (selectedColl1Name) {
        await getColl2Names()
      }
      if (selectedColl1Name && selectedColl2Name) {
        await getColl3Names()
      }
    }
    getCollectionsNames()
  }, [selectedColl1Name, selectedColl2Name])

  async function getColl1Names() {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:4000/proxy_route/unique-collection1-names')
      const data = await res.json()
      setColl1Names(data)
      setLoading(false)
    } catch (error) {
      setError('Error! Failed to fetch collection names. Try Again!')
    }
  }

  async function getColl2Names() {
    if (!selectedColl1Name) {
      return
    }
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:4000/proxy_route/unique-collection2-names?name=${selectedColl1Name}`)
      const data = await res.json()
      setColl2Names(data)
      setLoading(false)
    } catch (error) {
      setError('Error! Failed to fetch collection names. Try Again!')
    }
  }

  async function getColl3Names() {
    if (!selectedColl1Name && !selectedColl2Name) {
      return
    }
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:4000/proxy_route/unique-collection3-names?name1=${selectedColl1Name}&name2=${selectedColl2Name}`)
      const data = await res.json()
      setColl3Names(data)
      setLoading(false)
    } catch (error) {
      setError('Error! Failed to fetch collection names. Try Again!')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedColl1Name) {
      setColl1NameError(true)
      return
    }

    if (selectedColl1Name && !selectedColl2Name && !selectedColl3Name) {
      const coll1Obj = getCollObjFromCollName(selectedColl1Name, coll1Names)
      navigate(`/collections/${coll1Obj?.collection1.handle}`)
      return
    }
    if (selectedColl1Name && selectedColl2Name && !selectedColl3Name) {
      const coll2Obj = getCollObjFromCollName(selectedColl2Name, coll2Names)
      navigate(`/collections/${coll2Obj?.collection2.handle}`)
      return
    }
    if (selectedColl1Name && selectedColl2Name && selectedColl3Name) {
      const coll3Obj = getCollObjFromCollName(selectedColl3Name, coll3Names)
      navigate(`/collections/${coll3Obj?.collection3.handle}`)
      return
    }
  }

  function getCollObjFromCollName(name, coll) {
    return coll.find((c) => c.collection1Name === name || c.collection2Name === name || c.collection3Name === name)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            {coll1NameError ? (
              <span className={styles.error}>
                Please select Collection-1
              </span>
            ) : (
              <span className={styles.label}>
                Select Collection-1*
              </span>
            )}
            <select
              value={selectedColl1Name}
              onChange={(e) => setSelectedColl1Name(e.target.value)}
              className={styles.field}
              style={{ outline: coll1NameError && '3px solid #EA0029' }}
              required
            >
              <option value=''>
                Select Collection-1
              </option>
              {coll1Names.map((coll, index) => (
                <option key={index} value={coll.collection1Name}>
                  {coll.collection1Name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={styles.label}>
              Select Collection-2
            </span>
            <select
              value={selectedColl2Name}
              onChange={(e) => setSelectedColl2Name(e.target.value)}
              className={styles.field}
              disabled={!selectedColl1Name}
              style={{ cursor: !selectedColl1Name && 'not-allowed' }}
            >
              <option value=''>
                Select Collection-2
              </option>
              {coll2Names?.length > 0 && coll2Names.map((coll, index) => (
                <option key={index} value={coll.collection2Name}>
                  {coll.collection2Name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={styles.label}>
              Select Collection-3
            </span>
            <select
              value={selectedColl3Name}
              onChange={(e) => setSelectedColl3Name(e.target.value)}
              className={styles.field}
              disabled={!selectedColl1Name || !selectedColl2Name}
              style={{ cursor: (!selectedColl1Name || !selectedColl2Name) && 'not-allowed' }}
            >
              <option value=''>
                Select Collection-3
              </option>
              {coll3Names?.length > 0 && coll3Names.map((coll, index) => (
                <option key={index} value={coll.collection3Name}>
                  {coll.collection3Name}
                </option>
              ))}
            </select>
          </label>
          <button
            type='submit'
            className={styles.submitBtn}
            disabled={!selectedColl1Name || coll1NameError}
            style={{ cursor: !selectedColl1Name ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <SearchIcon />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg className={styles.searchIcon} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <div className={styles.spinner} />
  )
}
