import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome5';
import logo from './assets/Isotype.png'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'


const breatheTime = () => {

  const [breathe, setBreathe] = useState(1)
  const [intervalIDBbreathe, setIntervalIDbreathe] = useState(null)


  const update = () => {
    setBreathe(time => time + 1)
  }

  const startBreathe = () => {
    setIntervalIDbreathe(setInterval(update, 5000))

  }
  const stopBreathe = () => {
    clearInterval(intervalIDBbreathe)
    setIntervalIDbreathe(null)
  }

  // clear interval when component unmounts
  useEffect(() => () => {
    clearInterval(intervalIDBbreathe)
  }, [])

  return {
    breathe,
    startBreathe,
    stopBreathe
  }
}

const useTimer = (startTime) => {

  const [time, setTime] = useState(startTime)
  const [intervalID, setIntervalID] = useState(null)

  const hasTimerEnded = time <= 0
  const isTimerRunning = intervalID != null

  useEffect(() => {
    setTime(startTime)
  }, [startTime])

  const update = () => {
    setTime(time => time - 1000)
  }

  const startTimer = () => {
    if (!hasTimerEnded && !isTimerRunning) {
      setIntervalID(setInterval(update, 1000))
    }
  }
  const stopTimer = () => {
    clearInterval(intervalID)
    setIntervalID(null)
  }

  // clear interval when the timer ends
  useEffect(() => {
    if (hasTimerEnded) {
      clearInterval(intervalID)
      setIntervalID(null)
    }
  }, [hasTimerEnded])

  // clear interval when component unmounts
  useEffect(() => () => {
    clearInterval(intervalID)
  }, [])

  return {
    time,
    startTimer,
    stopTimer,
  }
}


const App = () => {

  const [duration, setDuration] = useState(60000)
  const { time, startTimer, stopTimer } = useTimer(duration)
  const { breathe, startBreathe, stopBreathe } = breatheTime()

  const [play, setPlay] = useState(false)
  const [breatheStatus, setBreatheStatus] = useState(false)

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    return [
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0")
    ].join(":");
  }

  const animatedValue = React.useRef(new Animated.Value(0)).current
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  const scalateAnimation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5]

  })

  const startAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      duration: 5000
    }).start();
    Animated.timing(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: 5000
    }).start()
  }

  const stopAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 5000
    }).start();
    Animated.timing(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: 5000
    }).start()
  }

  const animatedStyle = {
    transform: [{
      scale: scalateAnimation
    }]
  }

  useEffect(() => {
    if (play === false) {
      if (breatheStatus === false) {
        stopAnimation()
      }
      stopTimer()
      stopBreathe()
      setBreatheStatus(false)
    } else {
      if (time !== 0) {
        startAnimation()
        setBreatheStatus(false)
        startTimer()
        startBreathe()
      } else {
        setPlay(!play)
      }
    }
  }, [play])

  useEffect(() => {
    setBreatheStatus(!breatheStatus)
  }, [breathe])

  useEffect(() => {
    if (breatheStatus === true) {
      startAnimation()
    } else {
      stopAnimation()
    }
  }, [breathe])


  const resetProgres = (time) => {
    setDuration(time)
  }

  useEffect(() => {
    if (time === 0) {
      setPlay(false)
    }
  }, [time])

  const renderTime = ({ remainingTime }) => {
    return (
      <View style={{ backgroundColor: "#8d7ef1", borderRadius: 150, padding: 12 }}>
        <View style={{ backgroundColor: "#7f6cfb", borderRadius: 150, padding: 60 }}>
          <Animated.Image
            style={[styles.tinyLogo, animatedStyle]}
            source={logo}
          />
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#bcbcc9', '#7c66ff']}
      style={styles.linearGradient}
    >
      <Text style={styles.tittle}>Breathe & relax</Text>

      <Animated.View style={{
        opacity: fadeAnim,
      }}>
        <Text style={styles.subTittle}>{play ? breatheStatus === true ? "Exhale" : "Inhale" : ""}</Text>
      </Animated.View>

      <CountdownCircleTimer

        isPlaying={play}
        key={duration}
        duration={duration / 1000}
        accessible={true}
        children={<Text>hola</Text>}
        backgroundColor="black"
        colors={['#c3bdef']}
        trailColor="#7f7d99"
        strokeWidth={8}
        size={290}
      >
        {renderTime}
      </CountdownCircleTimer>


      <Text style={{ color: "#ffff", fontSize: 18 }}>{formatTime(time)}</Text>

      <View style={{ borderColor: "white", borderWidth: 1, borderRadius: 30 }}>
        <Icon name={play === false ? "play" : "pause"} onPress={() => setPlay(!play)} size={18} color="#ffff" style={{ padding: 15 }} />
      </View>

      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>

        <TouchableOpacity style={duration === 60000 ? styles.buttons : styles.unSelectedButtons} onPress={() => { resetProgres(60000) }} >
          <Icon name="clock" size={18} color="#ffff" style={{ marginLeft: 5 }} />
          <Text style={styles.buttonText}>1 min</Text>
        </TouchableOpacity>

        <TouchableOpacity style={duration === 120000 ? styles.buttons : styles.unSelectedButtons} onPress={() => { resetProgres(120000) }} >
          <Icon name="clock" size={18} color="#ffff" style={{ marginLeft: 5 }} />
          <Text style={styles.buttonText}>2 min</Text>
        </TouchableOpacity>

        <TouchableOpacity style={duration === 180000 ? styles.buttons : styles.unSelectedButtons} onPress={() => { resetProgres(180000) }} >
          <Icon name="clock" size={18} color="#ffff" style={{ marginLeft: 5 }} />
          <Text style={styles.buttonText}>3 min</Text>
        </TouchableOpacity>
      </View>

    </LinearGradient >
  )
}

const styles = StyleSheet.create({
  tittle: {
    color: "white",
    fontSize: 23,
    fontWeight: "700",
    marginTop: 50
  },
  subTittle: {
    color: "white",
    fontSize: 22
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: "space-between",
    borderRadius: 5,
    height: "100%",
    width: "100%",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9f91f8",
    paddingLeft: 6,
    paddingRight: 6,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 7
  },
  unSelectedButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#695cc1",
    paddingLeft: 6,
    paddingRight: 6,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 7
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    padding: 7,
    marginRight: 5
  },
  tinyLogo: {
    width: 83,
    height: 75,
  },
})
export default App