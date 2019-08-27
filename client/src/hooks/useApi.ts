import createUseContext from "constate";
import { useState } from "react";
import usePersistedState from "./usePersistedState";

const host = "192.168.1.13";
export const apiUrl = "http://" + host + ":8080";
export const wsUrl = "ws://" + host + ":8080/ws";

interface RoomSummary {
  id: string;
  name: string;
  playerCount: number;
}

interface CreateRoom {
  name: string;
  public: boolean;
  categories: string[];
}

const getRooms = async (): Promise<RoomSummary[]> => {
  try {
    const res = await fetch(apiUrl + "/api/rooms");
    const body = await res.json();
    return body;
  } catch {}
  return [];
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const res = await fetch(apiUrl + "/api/categories");
    const body = await res.json();
    return body;
  } catch {}
  return [];
};

const createRoom = async (room: CreateRoom): Promise<any | null> => {
  try {
    const id = Math.round(Math.random() * 10e8).toString(36);
    const res = await fetch(apiUrl + "/api/rooms/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(room)
    });
    return await res.json();
  } catch {}
  return null;
};

export default createUseContext(() => {
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [name, setName] = usePersistedState("", "name");

  const fetchRooms = async () => setRooms(await getRooms());

  const createAndRefresh = async (room: CreateRoom): Promise<any> => {
    const res = await createRoom(room);
    fetchRooms();
    return res;
  };

  return {
    rooms,
    createRoom: createAndRefresh,
    setName,
    name,
    fetchRooms
  };
});
