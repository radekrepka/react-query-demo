import React, { FC, useState, MouseEvent } from 'react';

interface Props {
  onSubmit: (id: string, name: string) => void;
}

const UserForm: FC<Props> = ({ onSubmit }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');

  const handleOnSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit(id, name);
  };

  return (
    <form>
      <label>ID:</label>{" "}
      <input type="text" value={id} onChange={e => setId(e.target.value)} />{" "}
      <label>Name:</label>{" "}
      <input type="text" value={name} onChange={e => setName(e.target.value)} />{" "}
      <button type="submit" onClick={handleOnSubmit}>Add user</button>
    </form>
  );
};

export default UserForm;
