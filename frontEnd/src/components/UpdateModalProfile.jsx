import { Modal, Button, Label, TextInput, Datepicker } from "flowbite-react";
import { useState } from "react";

export function UpdateModalProfile({ author, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    nome: author.nome,
    cognome: author.cognome,
    email: author.email,
    dataDiNascita: author.dataDiNascita,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Modal show={true} onClose={onClose}>
      <Modal.Header>Update Profile</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="nome">First Name</Label>
            <TextInput
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="cognome">Last Name</Label>
            <TextInput
              id="cognome"
              name="cognome"
              value={formData.cognome}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="dataDiNascita">Birth Date</Label>
            <Datepicker
              id="dataDiNascita"
              name="dataDiNascita"
              value={formData.dataDiNascita}
              onSelectedDateChanged={(date) => setFormData({ ...formData, dataDiNascita: date.toISOString().split('T')[0] })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="success">
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}