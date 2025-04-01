import User from "../models/User";

export const pong = (req, res) => {
    return res.status(200).json('pong');
}

export const fetchInfo = (req, res) => {
    const user = new User("John Doe", "john_awesome_doe", 40, "red");
    return res.status(200).json(user);
}