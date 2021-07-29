import "./style.css";
import { fromEvent } from "rxjs";
import {
  map,
  mergeMap,
  debounceTime,
  filter,
  distinctUntilChanged,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

const user$ = fromEvent(document.getElementById("search"), "keyup").pipe(
  debounceTime(300),
  // TODO: prop 참조 유틸리티 함수로 리팩토링할 것.
  map((event) => event.target.value),
  distinctUntilChanged(),
  // TODO: 특정 요소의 length 프로퍼티가 0 이상인지 확인하는 함수(empty)
  filter((query) => query.trim().length > 0),
  mergeMap((query) =>
    ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
  )
);

const $layer = document.getElementById("suggestLayer");

function drawLayer(items) {
  $layer.innerHTML = items
    .map((user) => {
      return /*html*/ `
        <li class="user">
          <img src="${user.avatar_url}" width="50px" height="50px"/>
          <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>    
        </li>
    `;
    })
    .join("");
}

user$.subscribe((value) => {
  drawLayer(value.items);
});
