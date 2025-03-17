import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Select,
  MenuItem,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
} from "@mui/material";
import { Brightness4, Brightness7, Info } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type NumberList = number[];
type FilterType = "all" | "even" | "odd";

const RandomNumberGenerator: React.FC = () => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(10);
  const [numbers, setNumbers] = useState<NumberList>([]);
  const [history, setHistory] = useState<NumberList[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [autoGenerate, setAutoGenerate] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoGenerate) {
      interval = setInterval(() => generateNumbers(), 3000);
    }
    return () => clearInterval(interval);
  }, [autoGenerate]);

  const generateNumbers = () => {
    const newNumbers: NumberList = Array.from(
      { length: count },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );

    const filteredNumbers: NumberList =
      filter === "even"
        ? newNumbers.filter((num) => num % 2 === 0)
        : filter === "odd"
        ? newNumbers.filter((num) => num % 2 !== 0)
        : newNumbers;

    setNumbers(filteredNumbers);
    setHistory((prev) => [filteredNumbers, ...prev]);
  };

  const clearNumbers = () => setNumbers([]);

  return (
    <Paper
      sx={{
        height: "100vh",
        bgcolor: theme === "dark" ? "#121212" : "#fff",
        p: 2,
      }}
    >
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Генератор випадкових чисел
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
          <IconButton color="inherit">
            <Info />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box display="flex" gap={2} my={2}>
          <TextField
            label="Мінімум"
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          />
          <TextField
            label="Максимум"
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
          />
          <TextField
            label="Кількість"
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" my={2}>
          <Button variant="contained" onClick={generateNumbers}>
            Згенерувати
          </Button>
          <Button variant="outlined" onClick={clearNumbers}>
            Очистити
          </Button>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
            />
          }
          label="Автогенерація (кожні 3 сек)"
        />

        <Box my={2}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
          >
            <MenuItem value="all">Усі</MenuItem>
            <MenuItem value="even">Парні</MenuItem>
            <MenuItem value="odd">Непарні</MenuItem>
          </Select>
        </Box>

        <Typography variant="h6">Згенеровані числа:</Typography>
        <Box
          sx={{
            p: 2,
            bgcolor: theme === "dark" ? "#333" : "#eee",
            minHeight: 50,
          }}
        >
          {numbers.join(", ")}
        </Box>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Гістограма:
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={numbers.map((num) => ({ value: num }))}>
            <XAxis dataKey="value" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3f51b5" />
          </BarChart>
        </ResponsiveContainer>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Історія генерацій:
        </Typography>
        <Box
          sx={{
            p: 2,
            bgcolor: theme === "dark" ? "#444" : "#ddd",
            minHeight: 50,
          }}
        >
          {history.map((entry, index) => (
            <Typography key={index} variant="body2">
              {entry.join(", ")}
            </Typography>
          ))}
        </Box>
      </Container>
    </Paper>
  );
};

export default RandomNumberGenerator;
