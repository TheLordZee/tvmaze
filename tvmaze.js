/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  try{
    const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
    const shows = res.data.map(function (show) {
      return show.show;
    })
    populateShows(shows);
  } catch (e) {
    alert('Request failed!');
  }
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let img = '';
    if (show.image !== null) {
      img = show.image.original;
    } else {
      img = '';
    }

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${img}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-danger getEpisodes">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  searchShows(query);

 // populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const show = await axios.get(`http://api.tvmaze.com/shows/${id}`)
  const showName = show.data.name;
  const episodeList = episodes.data.map((episode) => episode)
  populateEpisodes(episodeList, showName);
}

//creates episode list
function populateEpisodes(list, show) {
  $("#episode-list").empty();
  const $listArea = $('#episode-list')
  $listArea.append($(`<b>${show}</b>`))
  for (let episode of list) {
    let $item = $(`<ul>
      <li>Season ${episode.season} Episode ${episode.number}, ${episode.name}</li>
      </ul>
    `)
    $listArea.append($item);
  }
  $("#episodes-area").show();
}

//adds functionality to the episodes button

$('#shows-list').on('click', ".getEpisodes", function (e) {
  const id = $(e.target).closest('.Show').data('show-id');
  getEpisodes(id);
})
