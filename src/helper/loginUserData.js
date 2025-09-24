import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { all_routes } from "../Router/all_routes";
import { getUsers } from "../core/redux/action";
import { useDispatch, useSelector } from "react-redux";

export function useLoginData() {
    const route = all_routes;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState([]);
    const users = useSelector((state) => state.users);
    const val = localStorage.getItem("userID");

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    useEffect(() => {
        if (!isNaN(val) && Number.isInteger(Number(val)) && Number(val) > 0) {
            const id = Number(val);
            setLoginUser(users.find((i) => i.userId === id));
        }
        else
            navigate(route.signin);
    }, [users]);
    return loginUser;
}
