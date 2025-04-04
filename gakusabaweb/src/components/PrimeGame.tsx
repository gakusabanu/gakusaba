import React, { useState, useEffect } from 'react';

const PrimeNumberGame: React.FC = () => {
  // Game states
  const [currentSum, setCurrentSum] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>('');

  // Check if a number is prime
  const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    let i = 5;
    while (i * i <= num) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
      i += 6;
    }
    return true;
  };

  // Update scores based on the current sum
  const updateScore = (newSum: number, isPlayer: boolean): void => {
    const addLog = (message: string) => {
      setGameLog(prev => [...prev, message]);
    };

    if (isPrime(newSum)) {
      if (isPlayer) {
        setPlayerScore(prev => prev + newSum);
        addLog(`プレイヤーが合計${newSum}で${newSum}ポイント獲得しました！（素数）`);
      } else {
        setComputerScore(prev => prev + newSum);
        addLog(`コンピュータが合計${newSum}で${newSum}ポイント獲得しました！（素数）`);
      }
    } else {
      if (isPlayer) {
        addLog(`プレイヤーが合計${newSum}にしました（素数ではありません）`);
      } else {
        addLog(`コンピュータが合計${newSum}にしました（素数ではありません）`);
      }
    }
  };

  // Player makes a move
  const playerMove = (num: number): void => {
    if (!isPlayerTurn || gameOver) return;
    
    const newSum = currentSum + num;
    setCurrentSum(newSum);
    updateScore(newSum, true);
    
    // Check if player won
    if (playerScore + (isPrime(newSum) ? newSum : 0) >= 100) {
      setGameOver(true);
      setWinner('プレイヤー');
      return;
    }
    
    setIsPlayerTurn(false);
  };

  // Computer makes a move
  useEffect(() => {
    if (isPlayerTurn || gameOver) return;
    
    const timer = setTimeout(() => {
      // Simple AI strategy: prefer numbers that result in primes when possible
      let bestMove = 1;
      let bestScore = -1;
      
      for (let i = 1; i <= 5; i++) {
        const potentialSum = currentSum + i;
        if (isPrime(potentialSum) && potentialSum > bestScore) {
          bestMove = i;
          bestScore = potentialSum;
        }
      }
      
      // If no prime-resulting move was found, choose randomly
      if (bestScore === -1) {
        bestMove = Math.floor(Math.random() * 5) + 1;
      }
      
      const newSum = currentSum + bestMove;
      setGameLog(prev => [...prev, `コンピュータが${bestMove}を選びました`]);
      setCurrentSum(newSum);
      updateScore(newSum, false);
      
      // Check if computer won
      if (computerScore + (isPrime(newSum) ? newSum : 0) >= 100) {
        setGameOver(true);
        setWinner('コンピュータ');
        return;
      }
      
      setIsPlayerTurn(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isPlayerTurn, currentSum, computerScore, gameOver]);

  // Reset the game
  const resetGame = (): void => {
    setCurrentSum(0);
    setPlayerScore(0);
    setComputerScore(0);
    setIsPlayerTurn(true);
    setGameLog([]);
    setGameOver(false);
    setWinner('');
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">素数ポイントゲーム</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <div className="flex justify-between mb-4">
          <div className="text-center p-2 bg-blue-100 rounded-md w-1/2 mr-2">
            <h2 className="font-bold">プレイヤー</h2>
            <p className="text-2xl">{playerScore}点</p>
          </div>
          <div className="text-center p-2 bg-red-100 rounded-md w-1/2 ml-2">
            <h2 className="font-bold">コンピュータ</h2>
            <p className="text-2xl">{computerScore}点</p>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="font-bold">現在の合計</h3>
          <p className="text-3xl font-bold">{currentSum}</p>
          <p className="text-sm mt-1">{isPrime(currentSum) ? '（素数です！）' : '（素数ではありません）'}</p>
        </div>
        
        <div className="mb-4">
          <p className="mb-2 font-bold text-center">
            {gameOver 
              ? `ゲーム終了！${winner}の勝利！`
              : `${isPlayerTurn ? 'あなた' : 'コンピュータ'}の番です`}
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => playerMove(num)}
                disabled={!isPlayerTurn || gameOver}
                className={`py-2 px-4 rounded-md ${
                  isPlayerTurn && !gameOver
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        {gameOver && (
          <button
            onClick={resetGame}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            新しいゲームを始める
          </button>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mb-6 max-h-64 overflow-y-auto">
        <h3 className="font-bold mb-2">ゲームログ</h3>
        <ul className="text-sm">
          {gameLog.map((log, index) => (
            <li key={index} className="mb-1 pb-1 border-b border-gray-100">
              {log}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h3 className="font-bold mb-2">ルール</h3>
        <ul className="text-sm list-disc pl-5">
          <li>プレイヤーは交互に1〜5の数字を足していきます</li>
          <li>現在の合計が素数になったプレイヤーはその数分だけポイントを獲得します</li>
          <li>例: 最初のプレイヤーが3を選ぶ→合計3(素数なのでポイント獲得)、次のプレイヤーが4を選ぶ→合計7(素数なのでポイント獲得)</li>
          <li>100点に最初に到達したプレイヤーの勝利</li>
        </ul>
      </div>
    </div>
  );
};

export default PrimeNumberGame;