import Room from "../entities/room.js";

export default function getLobbiItemTemplate(room = new Room()){

    return `<a href="${room.roomLink || '#'}">
    <div class="cards__card">
      <span class="cards__card__topicRoom">
        ${room.subTopic}
        <i class="fa fa-home"></i>
      </span>
      <p class="cards__card__title">
      <p class="cards__card__title">
        ${room.topic}
      </p>
      <div class="cards__card__info">
        <div class="avatar">
          <img src="${room.owner.img}" alt="${room.owner.username}">
        </div>
        <div class="cards__card__info__speakers">
          <ul>
            ${
                room.featuredAttendees.slice(0, 4).map(
                    attendee => `<li>${attendee.username} <span role="img" class="emoji">💬</span></li>`
                ).join('\n')
            }
            <span class="cards__card__info__speakers__listeners">
              200 <i class="fa fa-user"></i> / ${room.speakersCount}
              <i class="fa fa-comment"></i>
            </span>
          </ul>
        </div>
      </div>
    </div>
    </a>`
}

