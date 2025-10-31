'use client'

import { cn } from "@/app/lib/utils"
import { useState, useRef, useEffect } from "react"

interface Props {
    className?: string
}

type NumberType = 'one-digit' | 'two-digit' | 'three-digit'

export default function MathGameWindow({className=""}:Props) {
    const [currentNumber, setCurrentNumber] = useState<number>(0)
    const [status, setStatus] = useState<string>("Нажмите Start чтобы начать")
    const [gameStage, setGameStage] = useState<'idle' | 'showing' | 'result'>('idle')
    const [numbers, setNumbers] = useState<number[]>([])
    const [totalSum, setTotalSum] = useState<number>(0)
    const [numberType, setNumberType] = useState<NumberType>('one-digit')
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [timerActive, setTimerActive] = useState<boolean>(false)

    // Таймер
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1)
            }, 1000)
        } else if (timeLeft === 0 && timerActive) {
            setTimerActive(false)
            ShowResult()
            setCurrentNumber(totalSum)
        }
        
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [timerActive, timeLeft])

    const NumberGen = (existingNumbers: number[]): number => {
        let newNumber: number
        do {
            if (numberType === 'one-digit') {
                newNumber = Math.floor(Math.random() * 9) + 1 // 1-9
            } else if (numberType === 'two-digit') {
                newNumber = Math.floor(Math.random() * 90) + 10 // 10-99
            } else {
                newNumber = Math.floor(Math.random() * 900) + 100 // 100-999
            }
        } while (existingNumbers.includes(newNumber))
        return newNumber
    }

    const getTimeLimit = (): number => {
        switch (numberType) {
            case 'one-digit': return 2
            case 'two-digit': return 5 
            case 'three-digit': return 10
            default: return 10
        }
    }

    const GameStart = () => {
        setGameStage('showing')
        setStatus("Смотрите внимательно...")
        setTimeLeft(0)
        setTimerActive(false)
        
        const generatedNumbers: number[] = []
        let sum = 0
        
        for (let i = 0; i < 3; i++) {
            const num = NumberGen(generatedNumbers)
            generatedNumbers.push(num)
            sum += num
        }
        
        setNumbers(generatedNumbers)
        setTotalSum(sum)
        
        let currentIndex = 0
        
        const showNextNumber = () => {
            if (currentIndex < generatedNumbers.length) {
                setCurrentNumber(generatedNumbers[currentIndex])
                currentIndex++
                setTimeout(showNextNumber, 500)
            } else {
                // Все числа показаны, запускаем таймер
                setCurrentNumber(0)
                const timeLimit = getTimeLimit()
                setTimeLeft(timeLimit)
                setTimerActive(true)
                setStatus(`Запомните числа и посчитайте сумму!`)
            }
        }
        
        showNextNumber()
    }

    const ShowResult = () => {
        setGameStage('result')
        setStatus(`Правильная сумма: ${numbers.join(' + ')} = ${totalSum}`)
    }

    const ResetGame = () => {
        setCurrentNumber(0)
        setStatus("Нажмите Start чтобы начать")
        setGameStage('idle')
        setNumbers([])
        setTotalSum(0)
        setTimeLeft(0)
        setTimerActive(false)
    }

    useEffect(() => {
        if (timerActive) {
            setStatus(`Посчитайте сумму! Осталось: ${timeLeft} сек`)
        }
    }, [timeLeft, timerActive])

    return (
        <div className={cn("text-white inline flex flex-col justify-center p-5 gap-5", className)}>
            {/* Таймер */}
            <div className="text-center">
                <div className={cn(
                    "text-lg font-bold transition-colors",
                    timeLeft <= 5 ? "text-red-400" : "text-yellow-400"
                )}>
                    {timerActive ? (
                        <div>{timeLeft} сек</div>
                    ) : (<div>Время</div>)}
                </div>
            </div>
            
            {/* Кнопки выбора разрядности */}
            <div className="flex gap-2 justify-center">
                <button
                    onClick={() => setNumberType('one-digit')}
                    disabled={gameStage !== 'idle'}
                    className={cn(
                        "px-3 py-1 text-xs border rounded-lg transition-colors",
                        numberType === 'one-digit' 
                            ? "bg-blue-600 border-blue-400" 
                            : "bg-gray-800 border-gray-600 hover:bg-gray-700",
                        gameStage !== 'idle' && "opacity-50 cursor-not-allowed"
                    )}
                >
                    1-значные
                </button>
                <button
                    onClick={() => setNumberType('two-digit')}
                    disabled={gameStage !== 'idle'}
                    className={cn(
                        "px-3 py-1 text-xs border rounded-lg transition-colors",
                        numberType === 'two-digit' 
                            ? "bg-blue-600 border-blue-400" 
                            : "bg-gray-800 border-gray-600 hover:bg-gray-700",
                        gameStage !== 'idle' && "opacity-50 cursor-not-allowed"
                    )}
                >
                    2-значные
                </button>
                <button
                    onClick={() => setNumberType('three-digit')}
                    disabled={gameStage !== 'idle'}
                    className={cn(
                        "px-3 py-1 text-xs border rounded-lg transition-colors",
                        numberType === 'three-digit' 
                            ? "bg-blue-600 border-blue-400" 
                            : "bg-gray-800 border-gray-600 hover:bg-gray-700",
                        gameStage !== 'idle' && "opacity-50 cursor-not-allowed"
                    )}
                >
                    3-значные
                </button>
            </div>
            
            {/* Отображение текущего числа */}
            <div className="inline text-center my-10 font-bold text-4xl" id="number">
                {currentNumber}
            </div>

            {/* Основная кнопка */}
            {gameStage === 'idle' ? (
                <button 
                    onClick={GameStart}
                    className="hover:bg-gray-900/70 px-8 py-2 border border-gray-700 bg-gray-900 rounded-lg transition-colors"
                >
                    start
                </button>
            ) : (
                <button 
                    onClick={ResetGame}
                    className="hover:bg-red-900/70 px-8 py-2 border border-red-700 bg-red-900 rounded-lg transition-colors"
                >
                    сброс
                </button>
            )}
            
            <div id="status" className="text-gray-400 min-h-6 text-center">
                {status}
            </div>
        </div>
    )
}