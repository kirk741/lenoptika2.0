import Button from './components/ui/Button/Button'
import Wrapper from './components/ui/Wrapper/Wrapper'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import BookingLayout from './components/booking/BookingLayout/BookingLayout'
import TeamSlider from './components/team/TeamSlider/TeamSlider'
import NewItems from './components/products/NewItems/NewItems'

function App() {
  return (
    <>
      <Header />
      <Wrapper>
        <BookingLayout />
        <NewItems />
        <TeamSlider />
      </Wrapper>
      <Footer />
    </>
  )
}

export default App