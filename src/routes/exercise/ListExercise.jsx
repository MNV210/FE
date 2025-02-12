import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Play, Lock } from 'lucide-react'
import { ExerciseApi } from '../../api/ExerciseApi'
import { useNavigate } from 'react-router-dom'
import { QuestionApi } from '../../api/Question'

export function ListExercise() {
  const [tracks, setTracks] = useState([])
  const [totalLessons, setTotalLessons] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [expandedTracks, setExpandedTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [score,setScore] = useState(null)

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const data = await ExerciseApi.listExerciseUserRegister({user_id: storedUser.info.id})
      setTracks(data.data)
      setLoading(false)
    //   setTracks(data.tracks)
    //   setTotalLessons(data.totalLessons)
    //   setTotalDuration(data.totalDuration)
    }
    fetchData()
  }, [])

  const toggleTrack = (courseId) => {
    setExpandedTracks(current => 
      current.includes(courseId) 
        ? current.filter(id => id !== courseId)
        : [...current, courseId]
    )
  }

  const handleClickToExercise = async (exerciseId) => {
    console.log(exerciseId)

      const response = await QuestionApi.historyMakeExercise({user_id:storedUser.info.id,exercise_id:exerciseId})
      console.log(response.data !=null)
      if(response.data !=null){
        navigate(`/exercise_result/${exerciseId}`)
      }else{
        navigate(`/quiz/${exerciseId}`)
      }
      // response.data.length !=null ?  : navigate(`/quiz/${exerciseId}`)
  }

  return (
    <div className="max-w-8xl mx-auto px-4 py-8 mt-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bài kiểm tra</h2>
        <div className="flex gap-8 text-gray-600">
          {/* <span>{totalLessons} bài học</span> */}
          {/* <span>Thời lượng {Math.floor(totalDuration / 3600)} giờ {Math.floor((totalDuration % 3600) / 60)} phút</span> */}
          {/* <button className="text-orange-500 hover:underline">Mở rộng tất cả</button> */}
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {tracks.map(track => {
            const isExpanded = expandedTracks.includes(track.id)
        //   const trackDuration = track.track_steps.reduce((acc, step) => acc + (step.step.duration || 0), 0)

            return (
              <div key={track.id} className="bg-gray-50 rounded-2xl overflow-hidden">
                <button
                  onClick={track.exercise && track.exercise.length > 0 ? () => toggleTrack(track.id) : null}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-lg">{track.course_name}</span>
                    {track.exercise && (
                      <span className="text-gray-500 text-sm">
                        ({track.exercise.length} bài tập)
                      </span>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {isExpanded && track.exercise && (
                  <div className="border-t border-gray-200">
                    {track.exercise.map(step => (
                      <div 
                          key={step.id}
                          className="px-6 py-4 flex items-center justify-between bg-orange-50 text-orange-500 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleClickToExercise(step.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-orange-100`}>
                              <span className="text-sm">Q</span>
                          </div>
                          
                          <span>{step.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}