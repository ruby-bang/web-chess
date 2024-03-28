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
    const elements = document.getElementsByClassName(`reset`);
    elements[0].style.backgroundColor = 'white';
    elements[0].style.color = 'black';
    elements[0].style.border = '2px solid black';
    axios.get('/moves/reset').then((res) => {
      histroyRefecht()

      fenRefetch()
      setMoves(res.data);
      console.log("board reset")
      elements[0].style.backgroundColor = 'black';
      elements[0].style.color = 'white';

    })
  }

  const enterHandle = (index) => {
    const elements = document.getElementsByClassName(`enterButton`);
    elements[0].style.backgroundColor = 'white';
    elements[0].style.color = 'black';
    elements[0].style.border = '2px solid black';

    console.log(index)
    let form_data = {
      "move": `-1`
    }
    axios.post('/moves', form_data)
      .then((res) => {
        histroyRefecht()
        fenRefetch()
        setMoves(res.data);
        elements[0].style.backgroundColor = 'black';
        elements[0].style.color = 'white';
      })
      .catch((error) => {
        console.error('Error submitting move:', error);
      });
  };

  const submitHandle = (index) => {
    const elements = document.getElementsByClassName(`button${index}`);
    elements[0].style.backgroundColor = 'white';
    elements[0].style.color = 'black';
    elements[0].style.border = '2px solid black';

    console.log(index)
    let form_data = {
      "move": `${(index != -1) ? moves[index] : -1}`
    }
    axios.post('/moves', form_data)
      .then((res) => {
        histroyRefecht()
        fenRefetch()
        setMoves(res.data);

        elements[0].style.border = '0px';
        elements[0].style.color = 'white';
        elements[0].style.backgroundColor = '#000';
      })
      .catch((error) => {
        console.error('Error submitting move:', error);
      });
  };

  const undoHandle = () => {
    const elements = document.getElementsByClassName(`undoButton`);
    elements[0].style.backgroundColor = 'white';
    elements[0].style.color = 'black';
    elements[0].style.border = '2px solid black';

    axios.get('/moves/undo')
      .then((res) => {
        histroyRefecht()
        fenRefetch()
        setMoves(res.data);
        elements[0].style.backgroundColor = 'black';
        elements[0].style.color = 'white';
      })
      .catch((error) => {
        console.error('Error submitting move:', error);
      });
  }

  return (
    <>
      <div className='bodyMenu'>
        <div className='fenView'>
          {fenData}
        </div>
        <div className='pgnView'>
          {moveHistory}
        </div>
        <div className='optionMenu'>
          <button className="undoButton" onClick={() => undoHandle()}>undo</button>
          <button className="enterButton" onClick={() => enterHandle(-1)}>Enter</button>
          <button className="reset" onClick={() => resetBoard()}>reset</button>
        </div>
        <center>
          {moves.map((move, index) => (
            <button className={`button${index}`} key={index} onClick={() => submitHandle(index)}>{move}</button>
          ))}
        </center>
      </div>
    </>
  );
}

export default App;
