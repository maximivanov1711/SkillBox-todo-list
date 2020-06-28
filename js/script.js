$(function () {
  createItemsFromLocalStorage();

  $(".add-todo-button").on("click", function () {
    const title = $("#todo-title-form").val();
    const desc = $("#todo-desc-form").val();

    if (title && desc) {
      createItem(title, desc, 100);
      addItemToLocalStorage(title, desc);
      updateList();

      $("#todo-title-form").val("");
      $("#todo-desc-form").val("");
    }
  });

  $(".todo-list").on("click", ".todo-delete-button", function () {
    removeItem($(this).parents(".todo-item")).then(() => {
      removeItemFromLocalStorage($(this).parents(".todo-item"));
      updateList();
    });
  });

  $(".todo-list").on("click", ".todo-collapse-button", function () {
    collapseItem($(this).parents(".todo-item"), 100);
    toggleIsCollapsed($(this));
  });
});

function createItem(title, desc, time) {
  const item = `
  <div class="todo-item active">
    <div class="todo-header">
      <h3 class="todo-title">${title}</h3>
      <button class="todo-delete-button">
        <img
          src="https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Close_Icon-512.png"
          alt="x-icon"
          width="15"
        />
      </button>
      <button class="todo-collapse-button">
        <img
          src="https://img.icons8.com/android/24/000000/collapse-arrow.png"
          alt="collapse-icon"
          width="18"
        />
      </button>
    </div>
    <div class="todo-body">
      <span class="todo-desc">
        ${desc}
      </span>
    </div>
  </div>
  `;

  $(".todo-list").append(item);
  $(".todo-item").last().css("display", "none").slideDown(time);
}

function removeItem($item) {
  return new Promise((resolve) => {
    $item.slideUp(100);
    setTimeout(() => {
      $item.remove();
      resolve();
    }, 100);
  });
}

function collapseItem($item, time) {
  $item.toggleClass("active");
  $item.find(".todo-body").slideToggle(time);
}

function addItemToLocalStorage(title, desc) {
  const itemObj = {
    title,
    desc,
    isCollapsed: false,
  };

  const todoListRaw = localStorage.getItem("todoList") || "[]";
  const todoListJSON = JSON.parse(todoListRaw);

  todoListJSON.push(itemObj);

  localStorage.setItem("todoList", JSON.stringify(todoListJSON));
}

function removeItemFromLocalStorage($item) {
  const itemIndex = Array.from($(".todo-list").children()).findIndex(
    (elem) => elem === $item[0]
  );

  const todoListRaw = localStorage.getItem("todoList") || "[]";
  const todoListJSON = JSON.parse(todoListRaw);

  todoListJSON.splice(itemIndex, 1);

  localStorage.setItem("todoList", JSON.stringify(todoListJSON));
}

function toggleIsCollapsed($item) {
  const itemIndex = Array.from($(".todo-list").children()).findIndex(
    (elem) => elem === $item.parents(".todo-item")[0]
  );

  const todoListRaw = localStorage.getItem("todoList") || "[]";
  const todoListJSON = JSON.parse(todoListRaw);

  todoListJSON[itemIndex].isCollapsed = !todoListJSON[itemIndex].isCollapsed;

  localStorage.setItem("todoList", JSON.stringify(todoListJSON));
}

function updateList() {
  if (!$(".todo-list").children().length) {
    $(".todo-list").html(`
      <span class="empty-list-placeholder">Список пуст...</span>
    `);
    $(".todo-list").addClass("empty");

    return;
  }

  $(".empty-list-placeholder").remove();
  $(".todo-list").removeClass("empty");
}

function createItemsFromLocalStorage() {
  const todoListRaw = localStorage.getItem("todoList") || "[]";
  const todoListJSON = JSON.parse(todoListRaw);

  todoListJSON.forEach((elem, index) => {
    createItem(elem.title, elem.desc, 0);

    if (elem.isCollapsed) collapseItem($(".todo-list").children().last(), 0);
  });

  updateList();
}
