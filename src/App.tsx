import "./App.css";
import { Box, Button, Grid, IconButton, Input, Stack, Table, Typography } from "@mui/joy";
import { Add, Delete, DeleteForever, Recycling, Remove } from "@mui/icons-material";
import Machine from "./machine";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

type Item = {
  name: string;
  color: string;
  quantity: number;
};

const COLORS = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#673ab7",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#9e9e9e",
  "#607d8b"
];

const serializeItems = (items: Item[]) => items.map(n => ([
    n.color.substring(1),
    n.name,
    n.quantity
  ]).join("_")).join("!");

const serialize = (title: string, items: Item[], pickedItems: Item[]) => btoa(encodeURIComponent(([
  title,
  serializeItems(items),
  serializeItems(pickedItems)
]).join(".")));

const deserializeItems = (data: string) => {
  if (data.length <= 0)
    return [];

  return data.split("!").map(n => {
    const [ color, name, quantity ] = n.split("_");
    const item: Item = {
      color: "#" + color,
      name,
      quantity: parseInt(quantity)
    };
    return item;
  });
};

const deserialize = (data: string) => {
  const [ title, items, pickedItems ] = decodeURIComponent(atob(data)).split(".");
  return {
    title,
    items: deserializeItems(items),
    pickedItems: deserializeItems(pickedItems)
  };
}

function App() {
  const [ loading, setLoading ] = useState(true);
  const [ title, setTitle ] = useState("");
  const [ items, setItems ] = useState<Item[]>([{
      color: COLORS[0],
      name: "1",
      quantity: 1
    }, {
      color: COLORS[5],
      name: "2",
      quantity: 1
    }
  ]);
  const [ pickedItems, setPickedItems ] = useState<Item[]>([]);

  useEffect(() => {
    try {
      const state = deserialize(window.location.hash.substring(1));
      setTitle(state.title);
      setItems(state.items);
      setPickedItems(state.pickedItems);
    } catch (e) {
      console.warn("illegal hash key");
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    if (loading)
      return;
    const hash = serialize(title, items, pickedItems);
    const url = new URL(window.location.href);
    url.hash = hash;
    window.history.replaceState(null, "", url);
  }, [ loading, title, items, pickedItems ]);

  return (
    <Stack spacing={1} sx={{
      height: "100%"
    }}>
      <Grid container spacing={2}>
        <Grid xs={10}>
          <Helmet>
            <title>{title && `${title} - `}確率抽選機</title>
          </Helmet>
          <Input placeholder="タイトル" variant="plain" size="lg"
          value={title}
          onChange={e => setTitle(e.target.value)}/>
        </Grid>
        <Grid xs={3}>

        </Grid>
      </Grid>
      <Grid container spacing={2} flexGrow={1}>
        <Grid xs={5}>
          <Stack height="100%">
            <Box height="50%" overflow="auto">
              <Typography level="h3">在庫</Typography>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>色</th>
                    <th>名前</th>
                    <th style={{ width: "30%" }}>数量</th>
                    <th style={{ width: "10%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((n, i) => <tr key={i}>
                    <td>
                      <Button sx={{
                        backgroundColor: n.color
                      }} />
                    </td>
                    <td>
                      <Input value={n.name}
                        onChange={e => setItems(v => {
                          v[i].name = e.target.value;
                          return [...v];
                        })}
                      />
                    </td>
                    <td>
                      <Stack spacing={1} direction="row">
                        <IconButton variant="outlined" size="sm"
                          onClick={() => setItems(v => {
                            v[i].quantity = Math.max(0, v[i].quantity - 1);
                            return [...v];
                          })}
                        >
                          <Remove />
                        </IconButton>
                        <Input value={n.quantity} />
                        <IconButton variant="outlined" size="sm"
                        onClick={() => setItems(v => {
                          v[i].quantity++;
                          return [...v];
                        })}
                        >
                          <Add />
                        </IconButton>
                      </Stack>
                    </td>
                    <td>
                      <IconButton variant="outlined" size="sm"
                      onClick={() => setItems(v => {
                        return [...v.filter((n, idx) => idx !== i)];
                      })}
                      >
                        <Delete />
                      </IconButton>
                    </td>
                  </tr>)}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <IconButton variant="outlined" size="sm"
                        onClick={() => {
                          const item: Item = {
                            color: COLORS[Math.floor(Math.random() * COLORS.length)],
                            name: "",
                            quantity: 1
                          };
                          setItems([...items, item]);
                        }}>
                          <Add />
                        </IconButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Box>
            <Box height="50%" overflow="auto">
              <Stack direction="row" justifyContent="space-between">
                <Typography level="h3">獲得済み</Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined"
                  onClick={() => {
                    for (let item of pickedItems) {
                      const n = items.find(n => n.name === item.name);
                      if (n)
                        n.quantity += item.quantity;
                      else
                        items.push({...item});
                    }
                    setItems([...items]);
                    setPickedItems([]);
                  }}
                  >
                    <Recycling sx={{ mr: 1 }} />
                    在庫に戻す
                  </Button>
                  <Button variant="outlined"
                  onClick={() => {
                    setPickedItems([]);
                  }}
                  >
                    <DeleteForever sx={{ mr: 1 }} />
                    廃棄する
                  </Button>
                </Stack>
              </Stack>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>色</th>
                    <th>名前</th>
                    <th style={{ width: "20%" }}>数量</th>
                  </tr>
                </thead>
                <tbody>
                { pickedItems.map((n, i) => <tr key={i}>
                  <td>
                    <Button sx={{
                        cursor: "default",
                        backgroundColor: n.color,
                        ":hover": {
                          backgroundColor: n.color
                        }
                      }} />
                  </td>
                  <td>
                    {n.name}
                  </td>
                  <td>
                    {n.quantity}
                  </td>
                </tr>)}
                </tbody>
              </Table>
            </Box>
          </Stack>
        </Grid>
        <Grid xs={7}>
          <Machine items={items}
          onFinish={item => {
            setItems(v => {
              const n = v.find(n => n.name === item.name);
              if (n) {
                n.quantity--;
                return [...v];
              }
              return v;
            })
            setPickedItems(v => {
              const n = v.find(n => n.name === item.name);
              if (n) {
                n.quantity++;
                return [...v];
              } else {
                return [...v, { ...item, quantity: 1 }];
              }
            })
          }} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default App;
