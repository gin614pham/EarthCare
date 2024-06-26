import {StyleSheet} from 'react-native';

const loginStyles = StyleSheet.create({
  background_container: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  input_container: {
    width: '100%',
    marginTop: 50,
    padding: 10,
    alignItems: 'center',
  },
  input: {
    height: 50,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
  },
  button: {
    alignItems: 'center',
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 64,
    borderRadius: 10,
    backgroundColor: '#35B6FF',
  },
  button_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#35B6FF',
  },
  link: {
    marginTop: 10,
    marginStart: 20,
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 14,
    color: '#469FD1',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  edit_button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 64,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#35B6FF',
  },
  dropdown: {
    height: 50,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

export default loginStyles;
