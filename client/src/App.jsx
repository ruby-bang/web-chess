import { useQuery } from 'react-query';
import '@fortawesome/fontawesome-free/css/all.css';
import axios from 'axios';
import undo from './assets/undo.png';
import flip from './assets/flip.png';
import reset from './assets/reset.png';
import './App.css'
import { useState } from 'react';

function App() {
  const [moves, setMoves] = useState([]);
  const [whoWin, setWhoWin] = useState("");

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

	const checkMate = () => {
    axios.get('/moves/checkmate')
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Network response was not ok');
        }
        setWhoWin("W " + (res.data === 'w' ? '0 - 1' : '1 - 0') + " B");
        return res.data;
      })
      .catch((error) => {
        throw new Error('Error fetching data:', error);
      })

	}
  const check = () => {
    axios.get('/moves/check')
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Network response was not ok');
        }
        const elements = document.getElementsByClassName(`enterButton`);
        if (res.data) {
          elements[0].style.backgroundColor = '#Eee ';
          elements[0].disabled = true

		checkMate()
        } else {
		setWhoWin("")
          elements[0].disabled = false
          elements[0].style.backgroundColor = '#fff ';
        }
        //return res.data;
      })
      .catch((error) => {
        throw new Error('Error fetching data:', error);
      })
  }

  const resetBoard = () => {
    const elements = document.getElementsByClassName(`reset`);
    elements[0].style.backgroundColor = '#000 ';
    elements[0].style.color = 'white';
    elements[0].style.border = '0';
    elements[0].style.boxShadow = ' 0 0px 2px rgba(0, 0, 0, 0.0)';
    axios.get('/moves/reset').then((res) => {
      histroyRefecht()

      check()
      fenRefetch()
      setMoves(res.data);
      console.log("board reset")
      elements[0].style.color = 'black';
      elements[0].style.border = ' 1px solid #DAD6D6';
      elements[0].style.backgroundColor = '#fff';
      elements[0].style.boxShadow = ' 0 0px 1px rgba(0, 0, 0, 0.4)';

    })
  }

  const enterHandle = () => {
    const elements = document.getElementsByClassName(`enterButton`);
    elements[0].style.backgroundColor = '#000 ';
    elements[0].style.color = 'white';
    elements[0].style.border = '0';
    elements[0].style.boxShadow = ' 0 0px 2px rgba(0, 0, 0, 0.0)';

          elements[0].disabled = true

    let form_data = {
      "move": `-1`
    }
    axios.post('/moves', form_data)
      .then((res) => {
        histroyRefecht()
        fenRefetch()
        setMoves(res.data);
        check()
          elements[0].disabled = false
        elements[0].style.color = 'black';
        elements[0].style.border = ' 1px solid #DAD6D6';
        elements[0].style.backgroundColor = '#fff';
        elements[0].style.boxShadow = ' 0 0px 1px rgba(0, 0, 0, 0.4)';
      })
      .catch((error) => {
        console.error('Error submitting move:', error);
      });
  };

  const submitHandle = (index) => {
    const elements = document.getElementsByClassName(`button${index}`);
    elements[0].style.backgroundColor = '#000 ';
    elements[0].style.color = 'white';
          elements[0].disabled = true
    elements[0].style.border = '0';
    elements[0].style.boxShadow = ' 0 0px 2px rgba(0, 0, 0, 0.0)';

    let form_data = {
      "move": `${(index != -1) ? moves[index] : -1}`
    }
    axios.post('/moves', form_data)
      .then((res) => {
        histroyRefecht()
        fenRefetch()
        setMoves(res.data);
        check()
          elements[0].disabled = false

        elements[0].style.color = 'black';
        elements[0].style.border = ' 1px solid #DAD6D6';
        elements[0].style.backgroundColor = '#fff';
        elements[0].style.boxShadow = ' 0 0px 1px rgba(0, 0, 0, 0.4)';
      })
      .catch((error) => {
        console.error('Error submitting move:', error);
      });
  };

  const undoHandle = () => {
    const elements = document.getElementsByClassName(`undoButton`);
    elements[0].style.backgroundColor = '#000 ';
    elements[0].style.color = 'white';
    elements[0].style.border = '0';
    elements[0].style.boxShadow = ' 0 0px 2px rgba(0, 0, 0, 0.0)';

    axios.get('/moves/undo')
      .then((res) => {
        histroyRefecht()
        fenRefetch()
        setMoves(res.data);
        check()

        elements[0].style.color = 'black';
        elements[0].style.border = '1px solid #DAD6D6';
        elements[0].style.backgroundColor = '#fff';
        elements[0].style.boxShadow = ' 0 0px 1px rgba(0, 0, 0, 0.4)';
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
	  <div className='bodyWho'>
	  {whoWin}
	  </div>
        <div className='pgnView'>
          {moveHistory}
        </div>
        <div className='optionMenu'>
          <button className="undoButton" onClick={() => undoHandle()}>
	  <i class="fas fa-undo"></i>
	  </button>
          <button className="enterButton" onClick={() => enterHandle()}>
	  	<i class="fas fa-sync"></i>
	</button>
          <button className="reset" onClick={() => resetBoard()}>
	  <i class="fas fa-trash"></i>
	</button>
        </div>
        <div className='buttonMenu'>
          {moves.map((move, index) => (
            <button className={`button${index}`} key={index} onClick={() => submitHandle(index)}>{move}</button>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
