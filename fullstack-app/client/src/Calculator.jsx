// Calculator.jsx
import { useState } from 'react';
import './Calculator.css';

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand, secondOperand, operator) => {
    // We'll implement this on the server side
    // For now, we'll use a local implementation as fallback
    
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEquals = async () => {
    const inputValue = parseFloat(display);
    
    if (firstOperand === null) {
      return;
    }
    
    try {
      // Call the backend for calculation
      const response = await fetch('http://localhost:3001/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstOperand,
          secondOperand: inputValue,
          operator,
        }),
      });
      
      const data = await response.json();
      setDisplay(String(data.result));
    } catch (error) {
      // Fallback to local calculation if server fails
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
    }
    
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="calculator-display">
          {display}
        </div>
        <div className="calculator-keypad">
          <button className="key key-clear" onClick={() => clear()}>AC</button>
          <button className="key key-operation" onClick={() => performOperation('/')}>÷</button>
          <button className="key key-operation" onClick={() => performOperation('*')}>×</button>
          
          <button className="key key-number" onClick={() => inputDigit('7')}>7</button>
          <button className="key key-number" onClick={() => inputDigit('8')}>8</button>
          <button className="key key-number" onClick={() => inputDigit('9')}>9</button>
          <button className="key key-operation" onClick={() => performOperation('-')}>-</button>
          
          <button className="key key-number" onClick={() => inputDigit('4')}>4</button>
          <button className="key key-number" onClick={() => inputDigit('5')}>5</button>
          <button className="key key-number" onClick={() => inputDigit('6')}>6</button>
          <button className="key key-operation" onClick={() => performOperation('+')}>+</button>
          
          <button className="key key-number" onClick={() => inputDigit('1')}>1</button>
          <button className="key key-number" onClick={() => inputDigit('2')}>2</button>
          <button className="key key-number" onClick={() => inputDigit('3')}>3</button>
          <button className="key key-equals" onClick={() => handleEquals()}>=</button>
          
          <button className="key key-number key-zero" onClick={() => inputDigit('0')}>0</button>
          <button className="key key-number" onClick={() => inputDecimal()}>.</button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;