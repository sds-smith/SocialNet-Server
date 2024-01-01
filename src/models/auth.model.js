
export const users = {
    Alison:     {username: 'Alison', password: 'alison123'},
    Shawn:      {username: 'Shawn', password: 'shawn123'},
    Schmacky:   {username: 'Schmacky', password: 'schmacky123'}
};

export const getUser = (username) => users[username]