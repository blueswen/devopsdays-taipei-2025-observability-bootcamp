import http from 'k6/http';
import { sleep } from 'k6';

export function setup() {
  var server = "localhost:8000";
  var mode = __ENV.MODE || "default";
  if (mode === "compose") {
    server = "app-a:8000";
  }
  // a todo list for traveling Kaoshiung
  var todo_list = [
    {
      "title": "Visit the Dragon and Tiger Pagodas",
      "description": "Explore the iconic Dragon and Tiger Pagodas at Lotus Pond, and don't forget to enter through the dragon's mouth and exit from the tiger's mouth for good luck.",
      "completed": false
    },
    {
      "title": "Enjoy the Night Market at Ruifeng",
      "description": "Discover the popular Ruifeng Night Market, known for its variety of street food, carnival games, and local goods, offering a lively experience in the heart of Kaohsiung.",
      "completed": false
    },
    {
      "title": "Take a Ferry to Cijin Island",
      "description": "Take a quick ferry ride to Cijin Island, a beautiful spot for beaches, seafood, and a hike up to the Cihou Lighthouse for stunning views of Kaohsiung harbor.",
      "completed": false
    },
    {
      "title": "Explore the Pier-2 Art Center",
      "description": "Visit the Pier-2 Art Center, a cultural hub with contemporary art exhibitions, creative shops, and outdoor art installations along the harbor.",
      "completed": false
    },
    {
      "title": "Visit Sizihwan Bay",
      "description": "Relax at Sizihwan Bay, famous for its beautiful sunset views, sandy beaches, and calm waters, offering a perfect spot to unwind and enjoy the ocean scenery.",
      "completed": false
    },
    {
      "title": "Visit Love River",
      "description": "Stroll along Love River, a scenic waterway that runs through the city, lined with parks, cafes, and walking paths, offering a peaceful escape from the urban bustle.",
      "completed": false
    },
    {
      "title": "Visit Kaohsiung Music Center",
      "description": "Explore the Kaohsiung Music Center, a modern architectural marvel with concert halls, music schools, and performance spaces, offering a vibrant cultural experience.",
      "completed": false
    }
  ]
  var current_todo_list = http.get(`http://${server}/todos`);
  todo_list.forEach(function(todo) {
    if (current_todo_list.body.includes(todo.title)) {
      return;
    }
    http.post(`http://${server}/todos`, JSON.stringify(todo), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }); 
}

export default function () {
  var server = "localhost:8000";
  var mode = __ENV.MODE || "default";
  if (mode === "compose") {
    server = "app-a:8000";
  }
  var tasks = ["query_all_todos", "query_todo", "update_todo"];
  tasks.forEach(function(task) {
    switch (task) {
      case "query_all_todos":
        http.get(`http://${server}/todos/`);
        break;
      case "query_todo":
        http.get(`http://${server}/todos/${Math.floor(Math.random()*10+1)}`);
        break;
      case "update_todo":
        http.put(`http://${server}/todos/${Math.floor(Math.random()*5+1)}`, JSON.stringify({
          "completed": Math.random() >= 0.5
        }), {
          headers: {
            "Content-Type": "application/json",
          },
        });
        break;
    }
  });
  sleep(0.5);
}
