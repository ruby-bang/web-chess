import { useQuery } from 'react-query';
import axios from 'axios';
import './App.css'
import { useState } from 'react';

function App() {
  const [moves, setMoves] = useState([]);

  const { data: moveHistory, isLoading: moveHistoryLoading, refetch: histroyRefecht } = useQuery('moveHistory', () => {
    return axios.get('/moves/history')
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return res.data;
      })
      .catch((error) => {
        throw new Error('Error fetching data:', error);
      })
  });


  const { data: fenData, isLoading: fenLoading, refetch: fenRefetch } = useQuery('movesFen', () =>
    axios.get('/moves/fen')
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return res.data;
      })
      .catch((error) => {
        throw new Error('Error fetching data:', error);
      })
  );
  const { isLoading, isError } = useQuery('movesData', () =>
    axios.get('/moves')
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Network response was not ok');
        }
        setMoves(res.data);
        return res.data;
      })
      .catch((error) => {
        throw new Error('Error fetching data:', error);
      })
  );

  if (moveHistoryLoading || isLoading || fenLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;

  const resetBoard = () => {
    axios.get('/moves/reset').then((res) => {
      histroyRefecht()

      fenRefetch()
      setMoves(res.data);
      console.log("board reset")
    })
  }

  const submitHandle = (index) => {
    console.log(index)
    let form_data = {
      "move": `${(index != -1) ? moves[index] : -1}`
    }
    axios.post('/moves', form_data)
      .then((res) => {
        histroyRefecht()
        fenRefetch()
        setMoves(res.data);
      })
      .catch((error) => {
        console.error('Error submitting move:', error);
      });
  };

  const undoHandle = () => {
    axios.get('/moves/undo')
      .then((res) => {
        histroyRefecht()
        fenRefetch()
        setMoves(res.data);
      })
      .catch((error) => {
        console.error('Error submitting move:', error);
      });
  }

  return (
    <>
      <div>
        <div className='pgnView'>
          {moveHistory}
        </div>
        <div className='optionMenu'>
          <button onClick={() => undoHandle()}>undo</button>
          <button onClick={() => submitHandle(-1)}>Enter</button>
          <button className="reset" onClick={() => resetBoard()}>reset</button>
        </div>
        {moves.map((move, index) => (
          <button key={index} onClick={() => submitHandle(index)}>{move}</button>
        ))}

        {fenData}
      </div>
    </>
  );
}

export default App;
