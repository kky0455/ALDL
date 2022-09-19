package ALDL.aldl.service;

import ALDL.aldl.auth.JwtTokenProvider;
import ALDL.aldl.auth.UserLoginPostReq;
import ALDL.aldl.db.UserRepository;
import ALDL.aldl.model.User;
import ALDL.aldl.model.UserForm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    public void signupUser(String email, String password, String name, String nickname){
        UserForm userForm = new UserForm();
        userForm.setEmail(email);
        userForm.setPassword(password);
        userForm.setName(name);
        userForm.setNickname(nickname);

        User user = userForm.toEntity();
        userRepository.save(user);

    }

    public String checkEmail(String email) {
        String emailvalue = userRepository.validEmail(email);
        return emailvalue;
    }
    public String checkNickname(String nickname) {
        String nickvalue = userRepository.validNickname(nickname);
        return nickvalue;
    }
    public String checkPassword(String email,String password){
        String check = userRepository.validPassword(email,password);
        return check;
    }

    public User getUserByUserEmail(String userEmail) {
        // 디비에 유저 정보 조회 (userId 를 통한 조회).
        System.out.println("유저ID 체크" + userEmail);
        User user = userRepository.findByUserEmail(userEmail).orElseGet(null);
        return user;
    }

    @Transactional
    public UserLoginPostReq userLogin(String email) throws Exception {
        User user = getUserByUserEmail(email);

        // 리프레쉬 토큰 발급
        user.changeRefreshToken(jwtTokenProvider.createRefreshToken(email));
        UserLoginPostReq userLoginPostReq = UserLoginPostReq.builder()
                .email(email)
                .accessToken(jwtTokenProvider.createToken(email))
                .refreshToken(user.getRefreshToken())
                .build();

        return userLoginPostReq;
    }

}
