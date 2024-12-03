import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import moment from 'moment-timezone';
import LinearGradient from 'react-native-linear-gradient';

import bem from 'react-native-bem';
import styles from './LessonCard.scss';
import { Lesson } from '../../../../../../services/Lesson/Lesson';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  lesson: Lesson,
  onClick?: Function,
}

// Var used to get from the env the special lessons
let TWO_TRIBES_ONE_SOUL_IDS = [];

const LessonCard = (props: Props) => {
  const { lesson, onClick } = props;
  const b = (selector) => bem(selector, props, styles);

  // The style root class
  let cardClass = '';
  // Array of instructor names string
  let instructorsNames: Array<string> = [];
  // Flag that indicates if the current lesson is available
  let isAvailable = false;

  if (lesson && lesson.instructors) {
    // Set the main root class
    cardClass = lesson.available === 0 ? 'lesson__card-not-available' : `lesson__card-normal`;
    // Get the instructors of the lesson and create an array of their names
    instructorsNames = lesson.instructors.map(instructor => instructor.name);
    // Set the flag for know if the lesson is available
    isAvailable = moment.utc(lesson.ends_at).tz('America/Merida') >= moment.tz('America/Merida');
  }

  /**
   * Validate if a lesson had a empty name and not is a community class
   * @param lesson The lesson
   */
  function isEmptyNameAndNotCommunity(lesson: Lesson) {
    return (!lesson.name || lesson.name === '' || lesson.name === ' ') && !lesson.community;
  }

  /**
   * Returns if the lesson had a empty name
   * @param lesson The lesson
   */
  function isEmptyName(lesson: Lesson) {
    return !lesson.name || lesson.name === '' || lesson.name === ' ';
  }

  /**
   * Return if a lesson is a Two Tribes One Soul special class
   * @param lesson_id 
   */
  function isTwoTribesOneSoul(lesson: Lesson) {
    let result = -1;
    if (lesson.name) {
      result = lesson.name.toLowerCase().search(/two tribes/);
    }
    return (TWO_TRIBES_ONE_SOUL_IDS.find(id => Number(id) === lesson.id) !== undefined) || (result !== -1);
  }

  /**
   * Return if a lesson is a hiit buddies special class
   * @param lesson_name 
   */
  function isHiitBuddies(lesson_name: String) {
    let result = -1;
    if (lesson_name) {
      result = lesson_name.toLowerCase().search(/hiit buddies/);
    }
    return result !== -1;
  }

  /**
   * Create the lesson name component, if had a empty name just return Null
   * @param lesson The lesson 
   */
  function getLessonName(lesson: Lesson) {
    return !isEmptyName(lesson) && !isTwoTribesOneSoul(lesson) && !isHiitBuddies(lesson.name) && !lesson.special ? <View style={b(`${cardClass}-${lesson.studio.slug}__name_container`)}>
      <Text style={b(`${cardClass}-${lesson.studio.slug}__name_container-text`)}>{lesson.name}</Text>
    </View> : null;
  }

  /**
   * Return the default style or the modify style when the lesson had a empty name
   * @param lesson The lesson
   */
  function getInfoContainerStyles(lesson: Lesson) {
    let card_style = b('lesson__card-padding');

    if (isEmptyNameAndNotCommunity(lesson)) {
      card_style[0] = { ...card_style[0], height: 175 };
    }
    return card_style;
  }

  /**
   * Return the main card class style, this function validate the availability of the lesson
   */
  function getMainCardStyle() {
    let card_style = b(cardClass);
    if (!isAvailable) {
      card_style[0] = { ...card_style[0], opacity: .4 };
      return card_style
    }
    return card_style;
  }

  /**
   * Return the places available text if is necessary
   * @param lesson The lesson
   */
  function getPlacesAvailables(lesson: Lesson) {
    const placeLabelStyle = b(`${cardClass}__lessons`);

    if (lesson.available === 0 || lesson.available === undefined) {
      return <Text style={placeLabelStyle}>Sin lugares disponibles</Text>
    }
    if (lesson.available <= 5) {
      return <Text style={placeLabelStyle}>{`${lesson.available} ${lesson.available === 1 ? 'Lugar disponible' : 'Lugares disponibles'}`}</Text>
    }
    return null;
  }

  /**
  * Function to get and return the studio underlayColor
  * @param lesson The lesson
  */
  function getStudioColor(lesson: Lesson) {
    return lesson.studio.slug === 'we-hiit' ? '#04108e' : '#58318b';
  }

  return (
    <View>
      {
        lesson ? <TouchableOpacity onPress={() => { if (onClick && isAvailable) onClick(lesson) }}>
          <View style={getMainCardStyle()} >
            <View style={getInfoContainerStyles(lesson)}>
              <Text style={b(`${cardClass}__hour`)}>{moment(lesson.starts_at).utc().tz('America/Merida').format('h:mm A')}</Text>
              <Text style={b(`${cardClass}__instructor_name`)}>{instructorsNames.length > 1 ? instructorsNames.join(' + ') : instructorsNames[0]}</Text>
              {
                getPlacesAvailables(lesson)
              }
            </View>
            {
              lesson.community && (!lesson.name || lesson.name === '') && !isTwoTribesOneSoul(lesson) && !lesson.special && <View style={b(`${cardClass}-${lesson.studio.slug}__name_container`)}>
                <Text style={b(`${cardClass}-${lesson.studio.slug}__name_container-text`)}>Community class</Text>
              </View>
            }
            {
              getLessonName(lesson)
            }
            {
              (isTwoTribesOneSoul(lesson) || isHiitBuddies(lesson.name) || lesson.special) && <LinearGradient
                colors={['#58318b', '#04108e']} // PURPLE / BLUE
                start={{ x: 0.2, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={b(`${cardClass}-${lesson.studio.slug}__special_container`)}>
                <Text style={b(`${cardClass}-${lesson.studio.slug}__special_container-text`)}>{lesson.name}</Text>
              </LinearGradient>
            }
          </View>
        </TouchableOpacity> : <View style={b('lesson__card-fill')}></View>
      }
    </View>
  )
}

export default LessonCard;