// have to run this command before npm run dev and after npm run server for some reason that I don't understand yet. Otherwise gives error:
// Remove-Item -Recurse -Force 'M:\.socials\FullStackOpen\fullstackopen_exercises\part2\phonebook\node_modules\.vite\deps'

import { useState, useEffect } from 'react';
import numService from '/src/services/numbers.js';

const Notification = ({ message, isError }) => {
  if (message === null) return null;

  const notificationStyle = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  return (
    <div className="notification" style={notificationStyle}>
      {message}
    </div>
  );
};

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

const NumberForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  addName,
}) => {
  return (
    <>
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const Numbers = ({ persons, search, delPerson }) => {
  return (
    <>
      <h2>Numbers</h2>
      <div>
        {persons
          .filter((person) => person.name.includes(search))
          .map((person) => (
            <div key={person.name}>
              {`${person.name} ${person.number} `}
              <button onClick={() => delPerson(person.id, person.name)}>
                delete
              </button>
            </div>
          ))}
      </div>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    console.log('effect');
    numService
      .getAll()
      .then((initialNumbers) => {
        console.log('promise fulfilled');
        setPersons(initialNumbers);
      })
      .catch(() => console.log('rejected'));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();

    const personToChange = persons.find((p) => p.name === newName);
    if (personToChange) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with the new number?`
        )
      ) {
        numService
          .update(personToChange.id, {
            name: newName,
            number: newNumber,
          })
          .then((returnedNumber) => {
            setPersons(
              persons.map((p) =>
                p.id !== returnedNumber.id ? p : returnedNumber
              )
            );
            setNotification(`Changed number for ${newName}`);
            setIsError(false);
            setTimeout(() => {
              setNotification(null);
            }, 5000);

            setNewName('');
            setNewNumber('');
          });
      }
    } else {
      numService
        .create({ name: newName, number: newNumber })
        .then((returnedNumber) => {
          setPersons(persons.concat(returnedNumber));
          setNotification(`Added new number for ${newName}`);
          setIsError(false);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
          setNewName('');
          setNewNumber('');
        });
    }
  };

  const delPerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      numService
        .deleteNum(id)
        .then((deletedNumber) => {
          setPersons(
            persons.filter((person) => person.id !== deletedNumber.id)
          );
          setNotification(`Deleted record for ${name}`);
          setIsError(false);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          setNotification(`Record of ${name} has already been removed.`);
          setIsError(true);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  return (
    <div>
      <Notification message={notification} isError={isError} />
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <NumberForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <Numbers persons={persons} search={search} delPerson={delPerson} />
    </div>
  );
};

export default App;
