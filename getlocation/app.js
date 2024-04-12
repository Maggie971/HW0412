const map = document.getElementById("map");
const getLocationButton = document.getElementById("get-location");
const searchButton = document.getElementById("search");
const locationInput = document.getElementById("location-input");
const countryContainer = document.getElementById("country-container");

// 点击获取定位按钮时，获取地理位置并显示在地图上
getLocationButton.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      map.innerHTML = `<iframe src="https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed" width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe>`;

      // 获取地理位置并显示在输入框中
      const location = await getLocationName(lat, long);
      locationInput.value = location;
    });
  }
});

// 获取地理位置名称
async function getLocationName(lat, long) {
  try {
    const response = await fetch(
      `http://api.positionstack.com/v1/reverse?access_key=d72c6b9912f63eb9912d54fefcf89c7d&query=${lat},${long}`
    );
    const data = await response.json();
    return data.data[0].label;
  } catch (error) {
    console.error("Error getting location:", error);
    return "Unknown Location";
  }
}

// 点击搜索按钮时，进行模糊搜索
searchButton.addEventListener("click", async () => {
  const userInput = locationInput.value.trim(); // 获取用户输入的搜索内容
  if (userInput) {
    try {
      const response = await fetch(
        `http://api.positionstack.com/v1/forward?access_key=d72c6b9912f63eb9912d54fefcf89c7d&query=${userInput}`
      );
      const data = await response.json();
      console.log(data);
      // 处理搜索结果并显示在页面上
      displaySearchResults(data);
    } catch (error) {
      console.error("Error searching:", error);
    }
  }
});

// 显示搜索结果
function displaySearchResults(data) {
  countryContainer.innerHTML = ""; // 清空容器
  if (data.data && data.data.length > 0) {
    data.data.forEach(result => {
      const continent = result.continent ? result.continent : "Unknown";
      const region = result.region ? result.region : "Unknown";
      const label = result.label ? result.label : "Unknown";
      
      const resultElement = document.createElement("div");
      resultElement.classList.add("result");
      resultElement.innerHTML = `
        <div class="content">
          <h2>Continent</h2>
          <p>${continent}</p>
        </div>
        <div class="region">
          <h2>Region</h2>
          <p>${region}</p>
        </div>
        <div class="label">
          <h2>Label</h2>
          <p>${label}</p>
        </div>`;
      
      countryContainer.appendChild(resultElement);
    });
  } else {
    const noResultsElement = document.createElement("p");
    noResultsElement.textContent = "No results found.";
    countryContainer.appendChild(noResultsElement);
  }
}
